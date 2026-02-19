import { Controller, Post, Req, UseGuards } from '@nestjs/common';
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

  @Post('tenant-master-data')
  async seedTenantMasterData(@Req() req: any) {
    const tenantId = req?.user?.tenants?.[0];
    const userId = req?.user?.userId;
    const userEmail = req?.user?.email;

    return this.demoSeedService.seedTenantMasterData(tenantId, userId, userEmail);
  }
}
