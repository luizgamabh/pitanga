/**
 * Points service for screen/device management.
 *
 * @author Luiz Gama
 */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PrismaService } from '../../database';
import { Point, PointLogEvent, PointStatus, UserRole } from '@prisma/client';
import {
  ActivatePointDto,
  CreatePointDto,
  PointHeartbeatDto,
  UpdatePointDto,
} from '@pitanga/shared-types';
import { generateActivationCode } from './utils/code-generator';

@Injectable()
export class PointsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find all points for a tenant
   */
  findAll(tenantId: string): Observable<Point[]> {
    return from(
      this.prisma.point.findMany({
        where: { tenantId },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  /**
   * Find a point by ID
   */
  findById(id: string): Observable<Point> {
    return from(
      this.prisma.point.findUnique({
        where: { id },
      }),
    ).pipe(
      map((point) => {
        if (!point) {
          throw new NotFoundException(`Point with ID ${id} not found`);
        }
        return point;
      }),
    );
  }

  /**
   * Find a point by activation code
   */
  findByCode(code: string): Observable<Point> {
    return from(
      this.prisma.point.findUnique({
        where: { code },
      }),
    ).pipe(
      map((point) => {
        if (!point) {
          throw new NotFoundException(`Point with code ${code} not found`);
        }
        return point;
      }),
    );
  }

  /**
   * Create a new point with unique activation code
   */
  create(dto: CreatePointDto, tenantId: string): Observable<Point> {
    return this.generateUniqueCode().pipe(
      switchMap((code) =>
        from(
          this.prisma.point.create({
            data: {
              name: dto.name,
              description: dto.description,
              orientation: dto.orientation,
              resolution: dto.resolution,
              location: dto.location,
              latitude: dto.latitude,
              longitude: dto.longitude,
              code,
              tenantId,
            },
          }),
        ),
      ),
    );
  }

  /**
   * Generate a unique activation code
   */
  private generateUniqueCode(): Observable<string> {
    const code = generateActivationCode();
    return from(
      this.prisma.point.findUnique({
        where: { code },
      }),
    ).pipe(
      switchMap((existing) => {
        if (existing) {
          // Code already exists, try again
          return this.generateUniqueCode();
        }
        return of(code);
      }),
    );
  }

  /**
   * Update a point
   */
  update(id: string, dto: UpdatePointDto): Observable<Point> {
    return this.findById(id).pipe(
      switchMap(() =>
        from(
          this.prisma.point.update({
            where: { id },
            data: {
              name: dto.name,
              description: dto.description,
              orientation: dto.orientation,
              resolution: dto.resolution,
              location: dto.location,
              latitude: dto.latitude,
              longitude: dto.longitude,
              wifiSsid: dto.wifiSsid,
              wifiPassword: dto.wifiPassword,
              isActive: dto.isActive,
            },
          }),
        ),
      ),
    );
  }

  /**
   * Delete a point
   */
  delete(id: string): Observable<Point> {
    return this.findById(id).pipe(
      switchMap(() =>
        from(
          this.prisma.point.delete({
            where: { id },
          }),
        ),
      ),
    );
  }

  /**
   * Link a device to a point (activation)
   */
  linkDevice(dto: ActivatePointDto): Observable<Point> {
    return this.findByCode(dto.code).pipe(
      map((point) => {
        if (point.deviceId && point.deviceId !== dto.deviceId) {
          throw new BadRequestException(
            'Point is already linked to another device',
          );
        }
        return point;
      }),
      switchMap((point) =>
        from(
          this.prisma.$transaction(async (tx) => {
            // Update point with device info
            const updatedPoint = await tx.point.update({
              where: { id: point.id },
              data: {
                deviceId: dto.deviceId,
                deviceModel: dto.deviceModel,
                deviceOS: dto.deviceOS,
                appVersion: dto.appVersion,
                status: PointStatus.ONLINE,
                activatedAt: point.activatedAt ?? new Date(),
                lastHeartbeat: new Date(),
              },
            });

            // Log activation
            await tx.pointLog.create({
              data: {
                pointId: point.id,
                event: PointLogEvent.ACTIVATED,
                message: `Device ${dto.deviceId} activated`,
                metadata: {
                  deviceModel: dto.deviceModel,
                  deviceOS: dto.deviceOS,
                  appVersion: dto.appVersion,
                },
              },
            });

            return updatedPoint;
          }),
        ),
      ),
    );
  }

  /**
   * Unlink a device from a point
   */
  unlinkDevice(id: string): Observable<Point> {
    return this.findById(id).pipe(
      switchMap((point) =>
        from(
          this.prisma.$transaction(async (tx) => {
            // Update point
            const updatedPoint = await tx.point.update({
              where: { id },
              data: {
                deviceId: null,
                deviceModel: null,
                deviceOS: null,
                appVersion: null,
                status: PointStatus.PENDING,
              },
            });

            // Log unlink
            await tx.pointLog.create({
              data: {
                pointId: id,
                event: PointLogEvent.OFFLINE,
                message: 'Device unlinked',
              },
            });

            return updatedPoint;
          }),
        ),
      ),
    );
  }

  /**
   * Process device heartbeat
   */
  heartbeat(dto: PointHeartbeatDto): Observable<Point> {
    return this.findById(dto.pointId).pipe(
      map((point) => {
        if (point.deviceId !== dto.deviceId) {
          throw new ForbiddenException('Device not linked to this point');
        }
        return point;
      }),
      switchMap((point) => {
        const wasOffline = point.status === PointStatus.OFFLINE;

        return from(
          this.prisma.$transaction(async (tx) => {
            // Update point
            const updatedPoint = await tx.point.update({
              where: { id: point.id },
              data: {
                status: PointStatus.ONLINE,
                lastHeartbeat: new Date(),
                appVersion: dto.appVersion ?? point.appVersion,
              },
            });

            // Log if coming back online
            if (wasOffline) {
              await tx.pointLog.create({
                data: {
                  pointId: point.id,
                  event: PointLogEvent.ONLINE,
                  message: 'Device back online',
                  metadata: dto.metrics,
                },
              });
            }

            return updatedPoint;
          }),
        );
      }),
    );
  }

  /**
   * Check if user has access to a point
   */
  checkAccess(
    userId: string,
    pointId: string,
    userRole: UserRole,
  ): Observable<boolean> {
    // SUPER_ADMIN has access to all points
    if (userRole === UserRole.SUPER_ADMIN) {
      return of(true);
    }

    // Get user's tenant and point's tenant
    return from(
      Promise.all([
        this.prisma.user.findUnique({
          where: { id: userId },
          select: { tenantId: true },
        }),
        this.prisma.point.findUnique({
          where: { id: pointId },
          select: { tenantId: true },
        }),
      ]),
    ).pipe(
      map(([user, point]) => {
        if (!user || !point || user.tenantId !== point.tenantId) {
          throw new ForbiddenException('Access denied to this point');
        }
        return true;
      }),
    );
  }

  /**
   * Get point with playlist assignments
   */
  findByIdWithPlaylists(id: string): Observable<
    Point & {
      playlists: Array<{
        id: string;
        priority: number;
        startTime: string | null;
        endTime: string | null;
        daysOfWeek: number[];
        playlist: { id: string; name: string };
      }>;
    }
  > {
    return from(
      this.prisma.point.findUnique({
        where: { id },
        include: {
          playlists: {
            include: {
              playlist: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: { priority: 'desc' },
          },
        },
      }),
    ).pipe(
      map((point) => {
        if (!point) {
          throw new NotFoundException(`Point with ID ${id} not found`);
        }
        return point;
      }),
    );
  }
}
