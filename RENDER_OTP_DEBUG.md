# Render Environment Variables Checklist

Make sure these are set in your Render dashboard:

## Required Email/SMTP Variables:
```
MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587
MAIL_USER=a2bae6001@smtp-brevo.com
MAIL_PASS=<your-brevo-api-key>
MAIL_FROM=Zeptac Technologies <sujalpatne05@gmail.com>
```

## How to Check:
1. Go to https://dashboard.render.com
2. Select your web service
3. Go to "Environment" tab
4. Verify all MAIL_* variables are set
5. Click "Manual Deploy" → "Deploy latest commit" to restart

## How to Test OTP:
1. Use a **different email** for testing (not sujalpatne05@gmail.com)
2. Try: `sujalpatne05+test1@gmail.com`
3. Register with Admin/User role
4. Check your email for 6-digit OTP
5. Enter OTP to complete registration

## If Still Not Working:
Check Render logs for errors:
```bash
# In Render Dashboard → Logs tab, look for:
- "📧 Attempting to send OTP"
- "✅ Email sent successfully"
- Or any SMTP errors
```
