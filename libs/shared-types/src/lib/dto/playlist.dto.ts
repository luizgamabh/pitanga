/**
 * Playlist DTOs for API requests/responses.
 *
 * @author Luiz Gama
 */
import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsArray,
  MinLength,
  MaxLength,
  Matches,
  Min,
  Max,
  ArrayMinSize,
} from 'class-validator';
import { PlaylistTransition } from '../enums/playlist.enum';

export class CreatePlaylistDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isRandom?: boolean;
}

export class UpdatePlaylistDto {
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
  @IsBoolean()
  isRandom?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AddPlaylistItemDto {
  @IsString()
  contentId!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3600)
  duration?: number;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Time must be in HH:mm format' })
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Time must be in HH:mm format' })
  endTime?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  daysOfWeek?: number[];

  @IsOptional()
  @IsEnum(PlaylistTransition)
  transition?: PlaylistTransition;
}

export class UpdatePlaylistItemDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(3600)
  duration?: number;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Time must be in HH:mm format' })
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Time must be in HH:mm format' })
  endTime?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  daysOfWeek?: number[];

  @IsOptional()
  @IsEnum(PlaylistTransition)
  transition?: PlaylistTransition;
}

export class ReorderPlaylistItemsDto {
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  itemIds!: string[];
}
