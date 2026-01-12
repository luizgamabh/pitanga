import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MediaPlaybackDocument = HydratedDocument<MediaPlayback>;

@Schema({ collection: 'media_playbacks', timestamps: false })
export class MediaPlayback {
  @Prop({ required: true, index: true })
  screenId: string;

  @Prop({ required: true, index: true })
  mediaId: string;

  @Prop({ required: true })
  playedAt: Date;

  @Prop({ required: true })
  duration: number; // segundos exibidos

  @Prop({ default: false })
  completed: boolean;

  @Prop({ type: Object })
  metadata?: Record<string, unknown>;
}

export const MediaPlaybackSchema = SchemaFactory.createForClass(MediaPlayback);
MediaPlaybackSchema.index({ screenId: 1, playedAt: -1 });
MediaPlaybackSchema.index({ mediaId: 1, playedAt: -1 });
