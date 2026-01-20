/**
 * Points module for screen/device management.
 *
 * @author Luiz Gama
 */
import { Module } from '@nestjs/common';
import { PointsController } from './points.controller';
import { PointsService } from './points.service';

@Module({
  controllers: [PointsController],
  providers: [PointsService],
  exports: [PointsService],
})
export class PointsModule {}
