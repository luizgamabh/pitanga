/**
 * Point (Screen/Device) DTOs for API requests/responses.
 *
 * @author Luiz Gama
 */
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { PointOrientation } from '../enums/point.enum';

export class CreatePointDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsEnum(PointOrientation)
  orientation?: PointOrientation;

  @IsOptional()
  @IsString()
  @Matches(/^\d{3,4}x\d{3,4}$/, {
    message: 'Resolution must be in format WIDTHxHEIGHT (e.g., 1920x1080)',
  })
  resolution?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;
}

export class UpdatePointDto {
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
  @IsEnum(PointOrientation)
  orientation?: PointOrientation;

  @IsOptional()
  @IsString()
  @Matches(/^\d{3,4}x\d{3,4}$/, {
    message: 'Resolution must be in format WIDTHxHEIGHT (e.g., 1920x1080)',
  })
  resolution?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  wifiSsid?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  wifiPassword?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ActivatePointDto {
  @IsString()
  @Matches(/^PTG-[A-Z0-9]{6}$/, { message: 'Invalid activation code format' })
  code!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  deviceId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  deviceModel?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  deviceOS?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  appVersion?: string;
}

export class PointHeartbeatDto {
  @IsString()
  pointId!: string;

  @IsString()
  deviceId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  appVersion?: string;

  @IsOptional()
  metrics?: Record<string, unknown>;
}

export class AssignPlaylistDto {
  @IsString()
  playlistId!: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  priority?: number;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:mm format',
  })
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Time must be in HH:mm format',
  })
  endTime?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  daysOfWeek?: number[];
}
