/**
 * Content (Media) interfaces.
 *
 * @author Luiz Gama
 */
import { ContentStatus, ContentType } from '../enums/content.enum';

/**
 * Full content entity
 */
export interface IContent {
  id: string;
  name: string;
  description: string | null;
  type: ContentType;
  fileUrl: string | null;
  thumbnailUrl: string | null;
  fileSize: number | null;
  mimeType: string | null;
  duration: number | null;
  width: number | null;
  height: number | null;
  offerConfig: IOfferConfig | null;
  priceTableId: string | null;
  weatherCity: string | null;
  youtubeUrl: string | null;
  rssUrl: string | null;
  webpageUrl: string | null;
  status: ContentStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
}

/**
 * Content summary for listings
 */
export interface IContentSummary {
  id: string;
  name: string;
  type: ContentType;
  thumbnailUrl: string | null;
  duration: number | null;
  status: ContentStatus;
  isActive: boolean;
}

/**
 * Offer content configuration
 */
export interface IOfferConfig {
  title: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  discount?: string;
  validUntil?: string;
  imageUrl?: string;
  backgroundColor?: string;
  textColor?: string;
}

/**
 * Create content input (base)
 */
export interface ICreateContentBase {
  name: string;
  description?: string;
}

/**
 * Create image/video content
 */
export interface ICreateMediaContent extends ICreateContentBase {
  type: ContentType.IMAGE | ContentType.VIDEO;
  // File upload handled separately
}

/**
 * Create offer content
 */
export interface ICreateOfferContent extends ICreateContentBase {
  type: ContentType.OFFER;
  offerConfig: IOfferConfig;
}

/**
 * Create price table content
 */
export interface ICreatePriceTableContent extends ICreateContentBase {
  type: ContentType.PRICE_TABLE;
  priceTableId: string;
}

/**
 * Create weather content
 */
export interface ICreateWeatherContent extends ICreateContentBase {
  type: ContentType.WEATHER;
  weatherCity: string;
}

/**
 * Create YouTube content
 */
export interface ICreateYoutubeContent extends ICreateContentBase {
  type: ContentType.YOUTUBE;
  youtubeUrl: string;
}

/**
 * Create RSS content
 */
export interface ICreateRssContent extends ICreateContentBase {
  type: ContentType.RSS;
  rssUrl: string;
}

/**
 * Create webpage content
 */
export interface ICreateWebpageContent extends ICreateContentBase {
  type: ContentType.WEBPAGE;
  webpageUrl: string;
}

/**
 * Union type for all content creation inputs
 */
export type ICreateContent =
  | ICreateMediaContent
  | ICreateOfferContent
  | ICreatePriceTableContent
  | ICreateWeatherContent
  | ICreateYoutubeContent
  | ICreateRssContent
  | ICreateWebpageContent;

/**
 * Update content input
 */
export interface IUpdateContent {
  name?: string;
  description?: string;
  offerConfig?: IOfferConfig;
  priceTableId?: string;
  weatherCity?: string;
  youtubeUrl?: string;
  rssUrl?: string;
  webpageUrl?: string;
  isActive?: boolean;
}

/**
 * Content upload result
 */
export interface IContentUploadResult {
  fileUrl: string;
  thumbnailUrl?: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number;
}
