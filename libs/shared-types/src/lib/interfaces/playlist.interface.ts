/**
 * Playlist interfaces.
 *
 * @author Luiz Gama
 */
import { PlaylistTransition } from '../enums/playlist.enum';
import { IContentSummary } from './content.interface';

/**
 * Full playlist entity
 */
export interface IPlaylist {
  id: string;
  name: string;
  description: string | null;
  isRandom: boolean;
  isActive: boolean;
  totalDuration: number;
  itemCount: number;
  createdAt: Date;
  updatedAt: Date;
  tenantId: string;
}

/**
 * Playlist summary for listings
 */
export interface IPlaylistSummary {
  id: string;
  name: string;
  isActive: boolean;
  totalDuration: number;
  itemCount: number;
}

/**
 * Playlist with items
 */
export interface IPlaylistWithItems extends IPlaylist {
  items: IPlaylistItem[];
}

/**
 * Playlist item
 */
export interface IPlaylistItem {
  id: string;
  order: number;
  duration: number;
  startTime: string | null;
  endTime: string | null;
  daysOfWeek: number[];
  transition: PlaylistTransition;
  createdAt: Date;
  updatedAt: Date;
  playlistId: string;
  contentId: string;
  content?: IContentSummary;
}

/**
 * Create playlist input
 */
export interface ICreatePlaylist {
  name: string;
  description?: string;
  isRandom?: boolean;
}

/**
 * Update playlist input
 */
export interface IUpdatePlaylist {
  name?: string;
  description?: string;
  isRandom?: boolean;
  isActive?: boolean;
}

/**
 * Add item to playlist
 */
export interface IAddPlaylistItem {
  contentId: string;
  duration?: number;
  startTime?: string;
  endTime?: string;
  daysOfWeek?: number[];
  transition?: PlaylistTransition;
}

/**
 * Update playlist item
 */
export interface IUpdatePlaylistItem {
  duration?: number;
  startTime?: string;
  endTime?: string;
  daysOfWeek?: number[];
  transition?: PlaylistTransition;
}

/**
 * Reorder playlist items
 */
export interface IReorderPlaylistItems {
  itemIds: string[];
}

/**
 * Assign playlist to point
 */
export interface IAssignPlaylistToPoint {
  pointId: string;
  playlistId: string;
  priority?: number;
  startTime?: string;
  endTime?: string;
  daysOfWeek?: number[];
}
