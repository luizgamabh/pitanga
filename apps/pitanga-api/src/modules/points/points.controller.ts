/**
 * Points controller for screen/device management.
 *
 * @author Luiz Gama
 */
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Point, UserRole } from '@prisma/client';
import { PointsService } from './points.service';
import {
  ActivatePointDto,
  CreatePointDto,
  PointHeartbeatDto,
  UpdatePointDto,
} from '@pitanga/shared-types';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { CurrentUser, Public, Roles } from '../../auth/decorators';
import { IAuthUser } from '@pitanga/auth-types';

@Controller('points')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PointsController {
  constructor(private readonly pointsService: PointsService) {}

  /**
   * List all points for the current user's tenant
   */
  @Get()
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.OPERATOR,
  )
  findAll(@CurrentUser() user: IAuthUser): Observable<Point[]> {
    if (user.role === UserRole.SUPER_ADMIN) {
      // For super admin, could return all points or require tenant filter
      // For now, return empty if no tenantId
      if (!user.tenantId) {
        return new Observable((subscriber) => {
          subscriber.next([]);
          subscriber.complete();
        });
      }
    }

    if (!user.tenantId) {
      return new Observable((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }

    return this.pointsService.findAll(user.tenantId);
  }

  /**
   * Get a point by ID
   */
  @Get(':id')
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MANAGER,
    UserRole.OPERATOR,
  )
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: IAuthUser,
  ): Observable<Point> {
    return this.pointsService
      .checkAccess(user.id, id, user.role as UserRole)
      .pipe(switchMap(() => this.pointsService.findByIdWithPlaylists(id)));
  }

  /**
   * Find a point by activation code (public endpoint for device activation)
   */
  @Public()
  @Get('code/:code')
  findByCode(
    @Param('code') code: string,
  ): Observable<{ id: string; name: string; code: string }> {
    return this.pointsService.findByCode(code).pipe(
      map((point) => ({
        id: point.id,
        name: point.name,
        code: point.code,
      })),
    );
  }

  /**
   * Create a new point
   */
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  create(
    @Body() dto: CreatePointDto,
    @CurrentUser() user: IAuthUser,
  ): Observable<Point> {
    if (!user.tenantId) {
      throw new Error('User must belong to a tenant to create points');
    }
    return this.pointsService.create(dto, user.tenantId);
  }

  /**
   * Update a point
   */
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePointDto,
    @CurrentUser() user: IAuthUser,
  ): Observable<Point> {
    return this.pointsService
      .checkAccess(user.id, id, user.role as UserRole)
      .pipe(switchMap(() => this.pointsService.update(id, dto)));
  }

  /**
   * Delete a point
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  delete(
    @Param('id') id: string,
    @CurrentUser() user: IAuthUser,
  ): Observable<{ success: boolean }> {
    return this.pointsService
      .checkAccess(user.id, id, user.role as UserRole)
      .pipe(
        switchMap(() => this.pointsService.delete(id)),
        map(() => ({ success: true })),
      );
  }

  /**
   * Link a device to a point (activation)
   * This is a public endpoint called by devices during activation
   */
  @Public()
  @Post('link')
  @HttpCode(HttpStatus.OK)
  linkDevice(@Body() dto: ActivatePointDto): Observable<Point> {
    return this.pointsService.linkDevice(dto);
  }

  /**
   * Unlink a device from a point
   */
  @Post(':id/unlink')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  @HttpCode(HttpStatus.OK)
  unlinkDevice(
    @Param('id') id: string,
    @CurrentUser() user: IAuthUser,
  ): Observable<Point> {
    return this.pointsService
      .checkAccess(user.id, id, user.role as UserRole)
      .pipe(switchMap(() => this.pointsService.unlinkDevice(id)));
  }

  /**
   * Process device heartbeat
   * This is a public endpoint called by devices to report status
   */
  @Public()
  @Post('heartbeat')
  @HttpCode(HttpStatus.OK)
  heartbeat(@Body() dto: PointHeartbeatDto): Observable<{ success: boolean }> {
    return this.pointsService
      .heartbeat(dto)
      .pipe(map(() => ({ success: true })));
  }
}
