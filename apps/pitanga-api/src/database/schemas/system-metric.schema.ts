import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SystemMetricDocument = HydratedDocument<SystemMetric>;

@Schema({ collection: 'system_metrics', timestamps: false })
export class SystemMetric {
  @Prop({ required: true, index: true })
  screenId: string;

  @Prop()
  cpu?: number;

  @Prop()
  memory?: number;

  @Prop()
  storage?: number;

  @Prop({ type: Object })
  network?: Record<string, unknown>;

  @Prop({ default: Date.now, index: true })
  timestamp: Date;
}

export const SystemMetricSchema = SchemaFactory.createForClass(SystemMetric);
SystemMetricSchema.index({ screenId: 1, timestamp: -1 });
