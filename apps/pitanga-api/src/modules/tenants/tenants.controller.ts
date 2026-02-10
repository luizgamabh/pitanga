/**
 * Tenants controller for multi-tenancy management.
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
import { Tenant, UserRole } from '@prisma/client';
import { TenantsService } from './tenants.service';
import { CreateTenantDto, UpdateTenantDto } from '@pitanga/shared-types';
import { JwtAuthGuard, RolesGuard } from '../../auth/guards';
import { CurrentUser, Roles } from '../../auth/decorators';
import { IAuthUser } from '@pitanga/auth-types';

@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  /**
   * List all tenants (SUPER_ADMIN only)
   */
  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  findAll(): Observable<Tenant[]> {
    return this.tenantsService.findAll();
  }

  /**
   * Get a tenant by ID
   * - SUPER_ADMIN can access any tenant
   * - Other users can only access their own tenant
   */
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: IAuthUser,
  ): Observable<Tenant & { _count: { users: number; points: number } }> {
    return this.tenantsService
      .checkAccess(user.id, id, user.role as UserRole)
      .pipe(switchMap(() => this.tenantsService.findByIdWithStats(id)));
  }

  /**
   * Create a new tenant (SUPER_ADMIN or ADMIN)
   */
  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  create(@Body() dto: CreateTenantDto): Observable<Tenant> {
    return this.tenantsService.create(dto);
  }

  /**
   * Update a tenant
   * - SUPER_ADMIN can update any tenant
   * - ADMIN can only update their own tenant
   */
  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTenantDto,
    @CurrentUser() user: IAuthUser,
  ): Observable<Tenant> {
    return this.tenantsService
      .checkAccess(user.id, id, user.role as UserRole)
      .pipe(switchMap(() => this.tenantsService.update(id, dto)));
  }

  /**
   * Soft delete a tenant (SUPER_ADMIN only)
   */
  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string): Observable<{ success: boolean }> {
    return this.tenantsService.delete(id).pipe(map(() => ({ success: true })));
  }
}
