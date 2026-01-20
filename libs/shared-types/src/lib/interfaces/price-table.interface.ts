/**
 * Price Table interfaces for menu boards.
 *
 * @author Luiz Gama
 */

/**
 * Full price table entity
 */
export interface IPriceTable {
  id: string;
  name: string;
  description: string | null;
  theme: string;
  showImages: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
}

/**
 * Price table summary
 */
export interface IPriceTableSummary {
  id: string;
  name: string;
  isActive: boolean;
  categoryCount?: number;
  itemCount?: number;
}

/**
 * Price table with categories and items
 */
export interface IPriceTableWithItems extends IPriceTable {
  categories: IPriceCategory[];
}

/**
 * Price category
 */
export interface IPriceCategory {
  id: string;
  name: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  priceTableId: string;
  items?: IPriceItem[];
}

/**
 * Price item
 */
export interface IPriceItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  order: number;
  imageUrl: string | null;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
}

/**
 * Create price table input
 */
export interface ICreatePriceTable {
  name: string;
  description?: string;
  theme?: string;
  showImages?: boolean;
}

/**
 * Update price table input
 */
export interface IUpdatePriceTable {
  name?: string;
  description?: string;
  theme?: string;
  showImages?: boolean;
  isActive?: boolean;
}

/**
 * Create price category input
 */
export interface ICreatePriceCategory {
  name: string;
  order?: number;
}

/**
 * Update price category input
 */
export interface IUpdatePriceCategory {
  name?: string;
  order?: number;
}

/**
 * Create price item input
 */
export interface ICreatePriceItem {
  name: string;
  description?: string;
  price: number;
  order?: number;
  imageUrl?: string;
  isAvailable?: boolean;
}

/**
 * Update price item input
 */
export interface IUpdatePriceItem {
  name?: string;
  description?: string;
  price?: number;
  order?: number;
  imageUrl?: string;
  isAvailable?: boolean;
}
