import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ForecastController } from './forecast.controller';
import { ForecastService } from './forecast.service';

@Module({
  controllers: [ForecastController],
  providers: [ForecastService, PrismaService],
  exports: [ForecastService],
})
export class ForecastModule {}
