/**
 * Tenant DTOs for API requests/responses.
 *
 * @author Luiz Gama
 */
import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { TenantGroupType } from '../enums/tenant.enum';

export class CreateTenantDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  legalName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  document?: string;

  @IsOptional()
  @IsEnum(TenantGroupType)
  groupType?: TenantGroupType;

  @IsOptional()
  @IsEmail()
  billingEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  billingAddress?: string;
}

export class UpdateTenantDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  legalName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  document?: string;

  @IsOptional()
  @IsEnum(TenantGroupType)
  groupType?: TenantGroupType;

  @IsOptional()
  @IsEmail()
  billingEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  billingAddress?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
