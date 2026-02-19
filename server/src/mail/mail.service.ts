import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly brevoApiKey?: string;
  private readonly fromEmail: string;
  private readonly fromName: string;
  private transporter?: Transporter;

  constructor(private configService: ConfigService) {
    // Preferred provider for Render deployments
    this.brevoApiKey =
      this.configService.get<string>('BREVO_API_KEY') ||
      this.configService.get<string>('MAIL_PASSWORD') ||
      this.configService.get<string>('MAIL_PASS');
    this.fromEmail = this.configService.get<string>('MAIL_FROM', 'noreply@iproduction.com');
    this.fromName = this.configService.get<string>('MAIL_FROM_NAME', 'IProduction');

    const mailHost = this.configService.get<string>('MAIL_HOST');
    const mailPort = this.configService.get<number>('MAIL_PORT');
    const mailUser = this.configService.get<string>('MAIL_USER');
    const mailPassword =
      this.configService.get<string>('MAIL_PASSWORD') ||
      this.configService.get<string>('MAIL_PASS');

    if (!this.brevoApiKey && mailHost && mailPort && mailUser && mailPassword) {
      this.transporter = nodemailer.createTransport({
        host: mailHost,
        port: Number(mailPort),
        secure: Number(mailPort) === 465,
        auth: {
          user: mailUser,
          pass: mailPassword,
        },
      });
      this.logger.log(`Mail provider initialized: SMTP (${mailHost}:${mailPort})`);
    } else if (this.brevoApiKey) {
      this.logger.log('Mail provider initialized: Brevo API');
    } else {
      this.logger.warn('Mail provider is not configured. Set BREVO_API_KEY or SMTP env variables.');
    }
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    const subject = 'IProduction - Login Verification Code';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 20px 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 10px 10px 0 0;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              padding: 30px;
              text-align: center;
            }
            .otp-code {
              display: inline-block;
              font-size: 36px;
              font-weight: bold;
              color: #667eea;
              background-color: #f0f0f0;
              padding: 15px 30px;
              border-radius: 8px;
              letter-spacing: 8px;
              margin: 20px 0;
            }
            .message {
              color: #333;
              font-size: 16px;
              line-height: 1.6;
              margin: 20px 0;
            }
            .warning {
              color: #e74c3c;
              font-size: 14px;
              margin-top: 20px;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #999;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏭 IProduction</h1>
            </div>
            <div class="content">
              <h2>Login Verification Code</h2>
              <p class="message">
                Please use the following One-Time Password (OTP) to complete your login:
              </p>
              <div class="otp-code">${otp}</div>
              <p class="message">
                This code will expire in <strong>10 minutes</strong>.
              </p>
              <p class="warning">
                ⚠️ If you didn't request this code, please ignore this email and secure your account.
              </p>
            </div>
            <div class="footer">
              <p>© 2026 IProduction. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `Your IProduction OTP is ${otp}. This code expires in 10 minutes.`;

    await this.sendEmail(email, subject, html, text);
  }

  async sendWelcomeEmail(email: string, fullName: string): Promise<void> {
    const subject = 'Welcome to IProduction!';
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding: 20px 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 10px 10px 0 0;
              color: white;
            }
            .content {
              padding: 30px;
            }
            .footer {
              text-align: center;
              padding-top: 20px;
              border-top: 1px solid #eee;
              color: #999;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏭 Welcome to IProduction!</h1>
            </div>
            <div class="content">
              <h2>Hello ${fullName}!</h2>
              <p>Thank you for registering with IProduction. Your account has been successfully created.</p>
              <p>You can now access our production management system and start optimizing your operations.</p>
            </div>
            <div class="footer">
              <p>© 2026 IProduction. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `Welcome to IProduction, ${fullName}! Your account has been created successfully.`;

    await this.sendEmail(email, subject, html, text);
  }

  private async sendEmail(to: string, subject: string, html: string, text: string): Promise<void> {
    if (this.brevoApiKey) {
      await this.sendViaBrevo(to, subject, html, text);
      return;
    }

    if (this.transporter) {
      await this.sendViaSmtp(to, subject, html, text);
      return;
    }

    throw new Error('Mail provider not configured. Set BREVO_API_KEY or SMTP env variables.');
  }

  private async sendViaBrevo(to: string, subject: string, html: string, text: string): Promise<void> {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': this.brevoApiKey as string,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: this.fromName,
          email: this.fromEmail,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Brevo API failed (${response.status}): ${errorText}`);
      throw new Error(`Failed to send email via Brevo (${response.status})`);
    }

    this.logger.log(`Email sent via Brevo to ${to}`);
  }

  private async sendViaSmtp(to: string, subject: string, html: string, text: string): Promise<void> {
    await this.transporter?.verify();
    await this.transporter?.sendMail({
      from: `${this.fromName} <${this.fromEmail}>`,
      to,
      subject,
      html,
      text,
    });
    this.logger.log(`Email sent via SMTP to ${to}`);
  }
}
