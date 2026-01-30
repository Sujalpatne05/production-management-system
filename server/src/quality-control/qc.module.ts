import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QcController } from './qc.controller';
import { QcService } from './qc.service';

@Module({
  controllers: [QcController],
  providers: [QcService, PrismaService],
  exports: [QcService],
})
export class QcModule {}
