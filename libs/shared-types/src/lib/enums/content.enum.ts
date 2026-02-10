/**
 * Content related enums.
 * Maps to Prisma Content enums.
 *
 * @author Luiz Gama
 */

/**
 * Types of content that can be displayed
 */
export enum ContentType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  OFFER = 'OFFER',
  PRICE_TABLE = 'PRICE_TABLE',
  WEATHER = 'WEATHER',
  YOUTUBE = 'YOUTUBE',
  RSS = 'RSS',
  WEBPAGE = 'WEBPAGE',
}

/**
 * Content processing status
 */
export enum ContentStatus {
  PROCESSING = 'PROCESSING', // Being processed (uploaded, transcoding)
  READY = 'READY', // Ready to use
  ERROR = 'ERROR', // Processing failed
}
