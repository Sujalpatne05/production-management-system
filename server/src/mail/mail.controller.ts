import { Controller, Get, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
  ) {}

  @Get('config')
  getMailConfig() {
    return {
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      user: this.configService.get<string>('MAIL_USER'),
      from: this.configService.get<string>('MAIL_FROM'),
      hasPassword: !!this.configService.get<string>('MAIL_PASSWORD'),
      hasMailPass: !!this.configService.get<string>('MAIL_PASS'),
    };
  }

  @Post('test')
  async testEmail(@Body() body: { email: string }) {
    try {
      const testOTP = '123456';
      await this.mailService.sendOTP(body.email, testOTP);
      return { success: true, message: 'Test email sent (check logs for details)' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
