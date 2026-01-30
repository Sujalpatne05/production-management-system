import { Module } from '@nestjs/common';
import { CustomersController, SuppliersController } from './parties.controller';
import { PartiesService } from './parties.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [CustomersController, SuppliersController],
  providers: [PartiesService],
  exports: [PartiesService],
})
export class PartiesModule {}
