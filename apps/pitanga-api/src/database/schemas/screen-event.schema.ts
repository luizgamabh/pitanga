import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScreenEventDocument = HydratedDocument<ScreenEvent>;

@Schema({ collection: 'screen_events', timestamps: false })
export class ScreenEvent {
  @Prop({ required: true, index: true })
  screenId: string;

  @Prop({ required: true })
  eventType: string;

  @Prop({ type: Object })
  payload?: Record<string, unknown>;

  @Prop({ default: Date.now, index: true })
  timestamp: Date;
}

export const ScreenEventSchema = SchemaFactory.createForClass(ScreenEvent);
ScreenEventSchema.index({ screenId: 1, timestamp: -1 });
