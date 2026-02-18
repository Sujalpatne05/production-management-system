# Email Authentication with OTP - Setup Guide

This document provides a complete guide for setting up and using the email authentication with OTP (One-Time Password) feature in the IProduction system.

## Features Implemented

✅ **Email OTP Authentication**
- 6-digit OTP sent via email during login
- OTP expiration after 10 minutes
- Maximum 3 attempts per OTP
- Automatic OTP cleanup after verification

✅ **Enhanced Login Flow**
1. User enters credentials
2. System verifies credentials
3. OTP sent to user's email
4. User enters OTP
5. System verifies OTP
6. User authenticated and logged in

✅ **Beautiful Email Templates**
- Professional HTML email design
- Branded IProduction theme
- Clear OTP display
- Security warnings

## Backend Setup

### 1. Install Dependencies

Already installed:
```bash
npm install nodemailer @types/nodemailer
```

### 2. Database Schema

The Prisma schema has been updated with OTP fields:
```prisma
model User {
  // ... existing fields
  otp       String?
  otpExpiry DateTime?
  otpAttempts Int     @default(0)
}
```

**Run migration** (when database is available):
```bash
cd server
npx prisma migrate dev --name add_otp_fields
npx prisma generate
```

### 3. Environment Variables

Add the following to your `server/.env` file:

```bash
# Email / SMTP Configuration
MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="your-email@gmail.com"
MAIL_PASSWORD="your-app-specific-password"
MAIL_FROM="noreply@iproduction.com"

# JWT Configuration (if not already present)
JWT_SECRET="your-jwt-secret-key-here"
JWT_EXPIRES_IN="7d"
```

### 4. Gmail Setup (If using Gmail)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App-Specific Password:
   - Go to Security → App passwords
   - Select "Mail" and "Other (Custom name)"
   - Name it "IProduction"
   - Copy the 16-character password
   - Use this as `MAIL_PASSWORD` in your `.env`

### 5. Other Email Providers

**Outlook/Office 365:**
```bash
MAIL_HOST="smtp.office365.com"
MAIL_PORT=587
```

**SendGrid:**
```bash
MAIL_HOST="smtp.sendgrid.net"
MAIL_PORT=587
MAIL_USER="apikey"
MAIL_PASSWORD="your-sendgrid-api-key"
```

**AWS SES:**
```bash
MAIL_HOST="email-smtp.us-east-1.amazonaws.com"
MAIL_PORT=587
MAIL_USER="your-ses-smtp-username"
MAIL_PASSWORD="your-ses-smtp-password"
```

## API Endpoints

### 1. Send OTP
**POST** `/auth/send-otp`

Request:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "message": "OTP sent successfully to your email"
}
```

### 2. Verify OTP
**POST** `/auth/verify-otp`

Request:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

Response:
```json
{
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "roles": [...]
  }
}
```

## Frontend Implementation

The login page has been updated with:

1. **Two-step authentication flow:**
   - Step 1: Enter credentials
   - Step 2: Enter OTP

2. **Features:**
   - Automatic OTP input formatting (6 digits only)
   - Back button to return to login
   - Clear status messages
   - Loading states
   - Error handling

3. **User Experience:**
   - Typing animation updates based on step
   - Smooth transitions between steps
   - Visual feedback for OTP input
   - Resend OTP capability (back button)

## Testing the Feature

### 1. Start the Backend
```bash
cd server
npm run start:dev
```

### 2. Start the Frontend
```bash
npm run dev
```

### 3. Test Login Flow

1. Go to the login page
2. Enter valid credentials
3. Click "Continue"
4. Check your email for OTP
5. Enter the 6-digit OTP
6. Click "Verify OTP"
7. You should be logged in

### 4. Test Error Scenarios

**Invalid OTP:**
- Enter wrong OTP → See error message
- After 3 attempts → OTP invalidated

**Expired OTP:**
- Wait 10 minutes
- Try to use OTP → See expiration error
- Request new OTP by going back

## Security Features

✅ **OTP Security:**
- 6-digit random OTP
- 10-minute expiration
- Maximum 3 attempts
- Automatic cleanup after verification

✅ **Email Security:**
- HTML injection prevention
- Secure SMTP connection (TLS)
- No sensitive data in emails

✅ **Rate Limiting (Recommended):**
Consider adding rate limiting to prevent OTP spam:
```typescript
// In auth.controller.ts
@Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 per minute
@Post('send-otp')
async sendOTP(@Body() dto: SendOTPDto) {
  return this.authService.sendOTP(dto);
}
```

## Troubleshooting

### Email Not Sending

1. **Check SMTP credentials:**
   ```bash
   # Test connection
   telnet smtp.gmail.com 587
   ```

2. **Check firewall:**
   - Ensure port 587 is open
   - Check antivirus/firewall settings

3. **Gmail-specific:**
   - Enable "Less secure app access" (not recommended)
   - Use App-Specific Password (recommended)
   - Check if account is locked

4. **Check logs:**
   ```bash
   # Server logs will show detailed error
   npm run start:dev
   ```

### OTP Not Working

1. **Check database:**
   ```sql
   SELECT otp, "otpExpiry", "otpAttempts" FROM "User" WHERE email = 'test@example.com';
   ```

2. **Check Prisma Client:**
   ```bash
   npx prisma generate
   ```

3. **Restart TypeScript server in VS Code:**
   - Press `Ctrl+Shift+P`
   - Type "Restart TS Server"

## Production Considerations

### 1. Email Service
- Use a reliable email service (SendGrid, AWS SES, Mailgun)
- Set up SPF, DKIM, DMARC records
- Monitor email delivery rates

### 2. Rate Limiting
- Implement rate limiting on OTP endpoints
- Prevent abuse and spam

### 3. Monitoring
- Log OTP send attempts
- Monitor OTP verification success rates
- Alert on unusual patterns

### 4. Backup Authentication
- Consider SMS as backup
- Implement "Resend OTP" button
- Add "Contact Support" option

## File Structure

```
server/
├── src/
│   ├── mail/
│   │   ├── mail.module.ts       # Mail module configuration
│   │   └── mail.service.ts      # Email sending service
│   ├── auth/
│   │   ├── auth.controller.ts   # OTP endpoints
│   │   ├── auth.service.ts      # OTP logic
│   │   ├── auth.module.ts       # Updated with MailModule
│   │   └── dto/
│   │       └── auth.dto.ts      # OTP DTOs
│   └── prisma/
│       └── schema.prisma        # Updated User model
└── .env.example                 # Mail configuration

src/
├── pages/
│   └── Login.tsx                # Updated login with OTP
└── services/
    └── authService.ts           # OTP API methods
```

## Credits

Implemented by: GitHub Copilot
Date: February 18, 2026
Feature: Email Authentication with OTP for IProduction System
