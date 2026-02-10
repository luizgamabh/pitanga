/**
 * Tenants service for multi-tenancy management.
 *
 * @author Luiz Gama
 */
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PrismaService } from '../../database';
import { Tenant, UserRole } from '@prisma/client';
import { CreateTenantDto, UpdateTenantDto } from '@pitanga/shared-types';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Find all tenants (SUPER_ADMIN only)
   */
  findAll(): Observable<Tenant[]> {
    return from(
      this.prisma.tenant.findMany({
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  /**
   * Find a tenant by ID
   */
  findById(id: string): Observable<Tenant> {
    return from(
      this.prisma.tenant.findUnique({
        where: { id },
      }),
    ).pipe(
      map((tenant) => {
        if (!tenant) {
          throw new NotFoundException(`Tenant with ID ${id} not found`);
        }
        return tenant;
      }),
    );
  }

  /**
   * Create a new tenant
   */
  create(dto: CreateTenantDto): Observable<Tenant> {
    return from(
      this.prisma.tenant.create({
        data: {
          name: dto.name,
          legalName: dto.legalName,
          document: dto.document,
          groupType: dto.groupType,
          billingEmail: dto.billingEmail,
          billingAddress: dto.billingAddress,
        },
      }),
    );
  }

  /**
   * Update a tenant
   */
  update(id: string, dto: UpdateTenantDto): Observable<Tenant> {
    return this.findById(id).pipe(
      switchMap(() =>
        from(
          this.prisma.tenant.update({
            where: { id },
            data: {
              name: dto.name,
              legalName: dto.legalName,
              document: dto.document,
              groupType: dto.groupType,
              billingEmail: dto.billingEmail,
              billingAddress: dto.billingAddress,
              isActive: dto.isActive,
            },
          }),
        ),
      ),
    );
  }

  /**
   * Soft delete a tenant (set isActive to false)
   */
  delete(id: string): Observable<Tenant> {
    return this.findById(id).pipe(
      switchMap(() =>
        from(
          this.prisma.tenant.update({
            where: { id },
            data: { isActive: false },
          }),
        ),
      ),
    );
  }

  /**
   * Check if user has access to a tenant
   */
  checkAccess(
    userId: string,
    tenantId: string,
    userRole: UserRole,
  ): Observable<boolean> {
    // SUPER_ADMIN has access to all tenants
    if (userRole === UserRole.SUPER_ADMIN) {
      return from(Promise.resolve(true));
    }

    // Other users can only access their own tenant
    return from(
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { tenantId: true },
      }),
    ).pipe(
      map((user) => {
        if (!user || user.tenantId !== tenantId) {
          throw new ForbiddenException('Access denied to this tenant');
        }
        return true;
      }),
    );
  }

  /**
   * Get tenant with user counts and statistics
   */
  findByIdWithStats(
    id: string,
  ): Observable<Tenant & { _count: { users: number; points: number } }> {
    return from(
      this.prisma.tenant.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              users: true,
              points: true,
            },
          },
        },
      }),
    ).pipe(
      map((tenant) => {
        if (!tenant) {
          throw new NotFoundException(`Tenant with ID ${id} not found`);
        }
        return tenant;
      }),
    );
  }
}
