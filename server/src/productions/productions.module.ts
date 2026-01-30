import { Module } from '@nestjs/common';
import {
  ProductionsController,
  ProductionLossesController,
  ProductionStagesController,
} from './productions.controller';
import { ProductionsService } from './productions.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [
    ProductionsController,
    ProductionLossesController,
    ProductionStagesController,
  ],
  providers: [ProductionsService],
  exports: [ProductionsService],
})
export class ProductionsModule {}
