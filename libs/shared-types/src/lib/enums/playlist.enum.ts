/**
 * Playlist related enums.
 * Maps to Prisma Playlist enums.
 *
 * @author Luiz Gama
 */

/**
 * Transition effects between playlist items
 */
export enum PlaylistTransition {
  NONE = 'NONE',
  FADE = 'FADE',
  SLIDE_LEFT = 'SLIDE_LEFT',
  SLIDE_RIGHT = 'SLIDE_RIGHT',
  SLIDE_UP = 'SLIDE_UP',
  SLIDE_DOWN = 'SLIDE_DOWN',
}
