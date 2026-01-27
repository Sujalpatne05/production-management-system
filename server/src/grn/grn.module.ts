import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GrnController } from './grn.controller';
import { GrnService } from './grn.service';

@Module({
  controllers: [GrnController],
  providers: [GrnService, PrismaService],
  exports: [GrnService],
})
export class GrnModule {}
