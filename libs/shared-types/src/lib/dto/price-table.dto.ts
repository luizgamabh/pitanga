/**
 * Price Table DTOs for API requests/responses.
 *
 * @author Luiz Gama
 */
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUrl,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class CreatePriceTableDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  theme?: string;

  @IsOptional()
  @IsBoolean()
  showImages?: boolean;
}

export class UpdatePriceTableDto {
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
  @IsString()
  @MaxLength(50)
  theme?: string;

  @IsOptional()
  @IsBoolean()
  showImages?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreatePriceCategoryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999)
  order?: number;
}

export class UpdatePriceCategoryDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999)
  order?: number;
}

export class CreatePriceItemDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @IsNumber()
  @Min(0)
  @Max(999999.99)
  price!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999)
  order?: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

export class UpdatePriceItemDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999999.99)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(999)
  order?: number;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
