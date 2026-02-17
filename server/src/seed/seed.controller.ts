import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DemoSeedService } from './demo-seed.service';

@Controller('seed')
@UseGuards(JwtAuthGuard)  // Protect all seed endpoints with authentication
export class SeedController {
  constructor(private readonly demoSeedService: DemoSeedService) {}

  @Post('demo')
  async seedDemo() {
    return this.demoSeedService.seedDemo();
  }
}
