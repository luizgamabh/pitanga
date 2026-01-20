/**
 * Point (Screen/Device) interfaces.
 *
 * @author Luiz Gama
 */
import { PointOrientation, PointStatus, PointLogEvent } from '../enums/point.enum';

/**
 * Full point entity
 */
export interface IPoint {
  id: string;
  name: string;
  description: string | null;
  code: string;
  orientation: PointOrientation;
  resolution: string | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  deviceId: string | null;
  deviceModel: string | null;
  deviceOS: string | null;
  appVersion: string | null;
  wifiSsid: string | null;
  status: PointStatus;
  isActive: boolean;
  lastHeartbeat: Date | null;
  lastSyncAt: Date | null;
  activatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
}

/**
 * Point summary for listings
 */
export interface IPointSummary {
  id: string;
  name: string;
  code: string;
  status: PointStatus;
  orientation: PointOrientation;
  location: string | null;
  lastHeartbeat: Date | null;
  isActive: boolean;
}

/**
 * Point with playlist assignments
 */
export interface IPointWithPlaylists extends IPoint {
  playlists: IPointPlaylistAssignment[];
}

/**
 * Point playlist assignment
 */
export interface IPointPlaylistAssignment {
  id: string;
  playlistId: string;
  playlistName: string;
  priority: number;
  startTime: string | null;
  endTime: string | null;
  daysOfWeek: number[];
}

/**
 * Create point input
 */
export interface ICreatePoint {
  name: string;
  description?: string;
  orientation?: PointOrientation;
  resolution?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Update point input
 */
export interface IUpdatePoint {
  name?: string;
  description?: string;
  orientation?: PointOrientation;
  resolution?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  wifiSsid?: string;
  wifiPassword?: string;
  isActive?: boolean;
}

/**
 * Point activation input (from device)
 */
export interface IActivatePoint {
  code: string;
  deviceId: string;
  deviceModel?: string;
  deviceOS?: string;
  appVersion?: string;
}

/**
 * Point heartbeat input
 */
export interface IPointHeartbeat {
  pointId: string;
  deviceId: string;
  appVersion?: string;
  metrics?: Record<string, unknown>;
}

/**
 * Point log entry
 */
export interface IPointLog {
  id: string;
  event: PointLogEvent;
  message: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
  pointId: string;
}
