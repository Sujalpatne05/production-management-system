import { Module } from '@nestjs/common';
import { ValidationService } from './validation.service';
import { PrismaModule } from '../prisma/prisma.module';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [PrismaModule, SettingsModule],
  providers: [ValidationService],
  exports: [ValidationService],
})
export class ValidationModule {}
