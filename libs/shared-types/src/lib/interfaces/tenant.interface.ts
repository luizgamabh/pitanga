/**
 * Tenant interfaces for multi-tenancy.
 *
 * @author Luiz Gama
 */
import { TenantGroupType } from '../enums/tenant.enum';

/**
 * Full tenant entity
 */
export interface ITenant {
  id: string;
  name: string;
  legalName: string | null;
  document: string | null;
  groupType: TenantGroupType;
  billingEmail: string | null;
  billingAddress: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Tenant summary for listings and references
 */
export interface ITenantSummary {
  id: string;
  name: string;
  groupType: TenantGroupType;
  isActive: boolean;
}

/**
 * Create tenant input
 */
export interface ICreateTenant {
  name: string;
  legalName?: string;
  document?: string;
  groupType?: TenantGroupType;
  billingEmail?: string;
  billingAddress?: string;
}

/**
 * Update tenant input
 */
export interface IUpdateTenant {
  name?: string;
  legalName?: string;
  document?: string;
  groupType?: TenantGroupType;
  billingEmail?: string;
  billingAddress?: string;
  isActive?: boolean;
}
