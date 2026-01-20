/**
 * Content (Media) DTOs for API requests/responses.
 *
 * @author Luiz Gama
 */
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsUrl,
  IsObject,
  MinLength,
  MaxLength,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ContentType } from '../enums/content.enum';

export class OfferConfigDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  originalPrice?: number;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  discount?: string;

  @IsOptional()
  @IsString()
  validUntil?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  backgroundColor?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  textColor?: string;
}

export class CreateContentDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsEnum(ContentType)
  type!: ContentType;

  // For OFFER type
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OfferConfigDto)
  offerConfig?: OfferConfigDto;

  // For PRICE_TABLE type
  @IsOptional()
  @IsString()
  priceTableId?: string;

  // For WEATHER type
  @IsOptional()
  @IsString()
  @MaxLength(100)
  weatherCity?: string;

  // For YOUTUBE type
  @IsOptional()
  @IsUrl()
  youtubeUrl?: string;

  // For RSS type
  @IsOptional()
  @IsUrl()
  rssUrl?: string;

  // For WEBPAGE type
  @IsOptional()
  @IsUrl()
  webpageUrl?: string;
}

export class UpdateContentDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OfferConfigDto)
  offerConfig?: OfferConfigDto;

  @IsOptional()
  @IsString()
  priceTableId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  weatherCity?: string;

  @IsOptional()
  @IsUrl()
  youtubeUrl?: string;

  @IsOptional()
  @IsUrl()
  rssUrl?: string;

  @IsOptional()
  @IsUrl()
  webpageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
