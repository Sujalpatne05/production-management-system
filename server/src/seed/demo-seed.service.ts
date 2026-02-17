import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DemoSeedService implements OnModuleInit {
  private readonly logger = new Logger(DemoSeedService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit() {
    const enabled = this.config.get<string>('SEED_DEMO');
    if (!enabled || !['1', 'true', 'yes', 'on'].includes(enabled.toLowerCase())) {
      return;
    }

    const tenantId = this.config.get<string>('DEMO_TENANT_ID') ?? 'demo-tenant-id';
    const tenantName = this.config.get<string>('DEMO_TENANT_NAME') ?? 'Demo Company';
    const adminEmail = this.config.get<string>('DEMO_ADMIN_EMAIL') ?? 'admin@demo.com';
    const adminName = this.config.get<string>('DEMO_ADMIN_NAME') ?? 'Admin User';

    this.logger.log('Seeding demo tenant/user (SEED_DEMO enabled).');

    const tenant = await this.prisma.tenant.upsert({
      where: { id: tenantId },
      update: {},
      create: {
        id: tenantId,
        name: tenantName,
        plan: 'enterprise',
        status: 'active',
      },
    });

    const role = await this.prisma.role.upsert({
      where: { name: 'Admin' },
      update: {},
      create: { name: 'Admin' },
    });

    const user = await this.prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: {
        email: adminEmail,
        fullName: adminName,
        status: 'active',
      },
    });

    await this.prisma.userRole.upsert({
      where: {
        userId_tenantId_roleId: {
          userId: user.id,
          tenantId: tenant.id,
          roleId: role.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        tenantId: tenant.id,
        roleId: role.id,
      },
    });

    this.logger.log('Demo tenant/user seed complete.');
  }
}
