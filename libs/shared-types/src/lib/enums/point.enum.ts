/**
 * Point (Screen) related enums.
 * Maps to Prisma Point enums.
 *
 * @author Luiz Gama
 */

/**
 * Screen orientation options
 */
export enum PointOrientation {
  LANDSCAPE = 'LANDSCAPE',
  PORTRAIT = 'PORTRAIT',
}

/**
 * Point status lifecycle
 */
export enum PointStatus {
  PENDING = 'PENDING', // Created but not activated
  ONLINE = 'ONLINE', // Active and connected
  OFFLINE = 'OFFLINE', // Activated but not sending heartbeats
  MAINTENANCE = 'MAINTENANCE', // Temporarily disabled
}

/**
 * Point activity log event types
 */
export enum PointLogEvent {
  ACTIVATED = 'ACTIVATED',
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  SYNC_STARTED = 'SYNC_STARTED',
  SYNC_COMPLETED = 'SYNC_COMPLETED',
  SYNC_FAILED = 'SYNC_FAILED',
  CONTENT_PLAYED = 'CONTENT_PLAYED',
  ERROR = 'ERROR',
}
