import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BomController } from './bom.controller';
import { BomService } from './bom.service';

@Module({
  controllers: [BomController],
  providers: [BomService, PrismaService],
  exports: [BomService],
})
export class BomModule {}
