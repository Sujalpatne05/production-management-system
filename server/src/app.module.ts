import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { RolesModule } from './roles/roles.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { ProductionsModule } from './productions/productions.module';
import { PartiesModule } from './parties/parties.module';
import { TransactionsModule } from './transactions/transactions.module';
import { StockModule } from './stock/stock.module';
import { AccountingModule } from './accounting/accounting.module';
import { ReportsModule } from './reports/reports.module';
import { PurchasesModule } from './purchases/purchases.module';
import { ApprovalsModule } from './approvals/approvals.module';
import { AuditModule } from './audit/audit.module';
import { AccountingPeriodsModule } from './accounting-periods/accounting-periods.module';
import { PdfModule } from './pdf/pdf.module';
import { SettingsModule } from './settings/settings.module';
import { ValidationModule } from './validation/validation.module';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const redisUrl = config.get<string>('REDIS_URL');
        if (!redisUrl) {
          return {
            ttl: 60_000,
            max: 100,
          };
        }
        return {
          store: redisStore,
          url: redisUrl,
          ttl: 60_000,
        };
      },
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        prefix: config.get<string>('BULLMQ_PREFIX') ?? 'prodmgmt',
        connection: {
          url: config.get<string>('REDIS_URL') ?? 'redis://localhost:6379',
        },
      }),
    }),
    BullModule.registerQueue({ name: 'default' }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TenantsModule,
    RolesModule,
    OrdersModule,
    ProductsModule,
    ProductionsModule,
    PartiesModule,
    TransactionsModule,
    StockModule,
    AccountingModule,
    ReportsModule,
    PurchasesModule,
    ApprovalsModule,
    AuditModule,
    AccountingPeriodsModule,
    PdfModule,
    SettingsModule,
    ValidationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
