import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SeedController } from './seed.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { DemoSeedService } from './demo-seed.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [SeedController],
  providers: [DemoSeedService],
})
export class SeedModule {}
