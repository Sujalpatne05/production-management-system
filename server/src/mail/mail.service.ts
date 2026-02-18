import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Support both MAIL_PASSWORD and MAIL_PASS for backward compatibility
    const mailPassword = this.configService.get<string>('MAIL_PASSWORD') || 
                        this.configService.get<string>('MAIL_PASS');
    
    console.log('🔧 Mail Service Configuration:');
    console.log('   Host:', this.configService.get<string>('MAIL_HOST'));
    console.log('   Port:', this.configService.get<number>('MAIL_PORT'));
    console.log('   User:', this.configService.get<string>('MAIL_USER'));
    console.log('   From:', this.configService.get<string>('MAIL_FROM'));
    console.log('   Has Password:', !!mailPassword);
    
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('MAIL_PORT', 587),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: mailPassword,
      },
      pool: true,
      maxConnections: 1,
      maxMessages: 3,
      rateDelta: 1000,
      rateLimit: 3,
      connectionTimeout: 60000, // 60 seconds
      greetingTimeout: 30000, // 30 seconds
      socketTimeout: 60000, // 60 seconds
    });
  }

  async sendOTP(email: string, otp: string): Promise<void> {
    console.log('📧 Attempting to send OTP email to:', email);
    console.log('🔑 OTP Code:', otp);
    
    const mailOptions = {
      from: this.configService.get<string>('MAIL_FROM', 'noreply@iproduction.com'),
      to: email,
      subject: 'IProduction - Login Verification Code',
      html: `
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
      `,
    };

    try {
      console.log('📨 Sending email with options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      });
      
      console.log('🔌 Verifying SMTP connection...');
      await this.transporter.verify();
      console.log('✅ SMTP connection verified successfully');
      
      // Add timeout to prevent hanging (increased to 60 seconds for Render)
      const sendMailPromise = this.transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email timeout after 60 seconds')), 60000)
      );
      
      const result = await Promise.race([sendMailPromise, timeoutPromise]);
      console.log('✅ OTP Email sent successfully!', result);
    } catch (error) {
      console.error('❌ Error sending OTP email:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      if (error.code) console.error('Error code:', error.code);
      if (error.command) console.error('SMTP command:', error.command);
      if (error.response) console.error('SMTP response:', error.response);
      console.warn('⚠️ OTP saved to database but email delivery failed');
    }
  }

  async sendWelcomeEmail(email: string, fullName: string): Promise<void> {
    console.log('📧 Attempting to send welcome email to:', email);
    
    const mailOptions = {
      from: this.configService.get<string>('MAIL_FROM', 'noreply@iproduction.com'),
      to: email,
      subject: 'Welcome to IProduction!',
      html: `
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
      `,
    };

    try {
      console.log('📨 Sending welcome email...');
      
      console.log('🔌 Verifying SMTP connection...');
      await this.transporter.verify();
      console.log('✅ SMTP connection verified successfully');
      
      // Add timeout to prevent hanging (increased to 60 seconds for Render)
      const sendMailPromise = this.transporter.sendMail(mailOptions);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Email timeout after 60 seconds')), 60000)
      );
      
      const result = await Promise.race([sendMailPromise, timeoutPromise]);
      console.log('✅ Welcome email sent successfully!', result);
    } catch (error) {
      console.error('❌ Error sending welcome email:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      if (error.code) console.error('Error code:', error.code);
      if (error.command) console.error('SMTP command:', error.command);
      if (error.response) console.error('SMTP response:', error.response);
      console.warn('⚠️ Registration successful but welcome email delivery failed');
    }
  }
}
