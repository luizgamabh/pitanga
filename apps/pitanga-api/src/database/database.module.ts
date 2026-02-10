import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PrismaService } from './prisma.service';
import {
  AuditLog,
  AuditLogSchema,
  MediaPlayback,
  MediaPlaybackSchema,
  ScreenEvent,
  ScreenEventSchema,
  SystemMetric,
  SystemMetricSchema,
} from './schemas';

@Global()
@Module({
  imports: [
    // MongoDB via Mongoose
    MongooseModule.forRoot(
      process.env.MONGODB_URL || 'mongodb://localhost:27017/pitanga',
    ),
    MongooseModule.forFeature([
      { name: ScreenEvent.name, schema: ScreenEventSchema },
      { name: MediaPlayback.name, schema: MediaPlaybackSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: SystemMetric.name, schema: SystemMetricSchema },
    ]),
  ],
  providers: [PrismaService],
  exports: [PrismaService, MongooseModule],
})
export class DatabaseModule {}
