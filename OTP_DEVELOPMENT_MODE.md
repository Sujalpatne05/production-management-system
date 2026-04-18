# OTP in Development Mode

## 📝 Important Note

In **development mode**, the OTP is **NOT sent to email**. Instead, it is:
1. **Logged to backend console** - You can see it in the terminal
2. **Returned in API response** - Frontend can display it
3. **Stored in memory** - Valid for 10 minutes

---

## 🔍 How to Get OTP

### Method 1: Check Backend Logs (Recommended)

1. Look at the backend terminal
2. Find the line: `📧 OTP for sujalpatne583@gmail.com: 745147`
3. Copy the 6-digit code

**Example:**
```
[2026-04-11T09:24:05.401Z] POST /api/auth/send-otp
📧 OTP for sujalpatne583@gmail.com: 745147
```

### Method 2: Check Browser Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Find the `send-otp` request
4. Click on it
5. Go to Response tab
6. Look for `"otp": "745147"`

**Example Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "otp": "745147"
}
```

---

## 🚀 Complete Registration Flow

### Step 1: Register User
- Fill registration form
- Click "Register"
- User created in database ✅

### Step 2: OTP Sent
- Backend generates OTP
- OTP logged to console: `📧 OTP for email: 745147`
- Frontend shows OTP verification step

### Step 3: Get OTP Code
**Option A - Backend Console:**
```
📧 OTP for sujalpatne583@gmail.com: 745147
```

**Option B - Browser Network Tab:**
```json
{
  "otp": "745147"
}
```

### Step 4: Enter OTP
1. Copy the 6-digit code
2. Paste in OTP field on frontend
3. Click "Verify OTP"

### Step 5: Login
- Username: Sujal05
- Password: Sujal@123
- Should login successfully ✅

---

## 📊 Current OTP Status

| Component | Status | Details |
|-----------|--------|---------|
| OTP Generation | ✅ Working | 6-digit code generated |
| OTP Storage | ✅ Working | Stored in memory (10 min expiry) |
| OTP Logging | ✅ Working | Logged to backend console |
| OTP Response | ✅ Working | Returned in API response |
| Email Service | ❌ Not Configured | For production only |

---

## 🔧 For Production

To send OTP via email in production, you need to:

1. **Configure Email Service** (e.g., SendGrid, AWS SES, Gmail)
2. **Update send-otp endpoint** to send email
3. **Remove OTP from response** for security

**Example with SendGrid:**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: email,
  from: 'noreply@example.com',
  subject: 'Your OTP Code',
  text: `Your OTP code is: ${otp}`,
};

await sgMail.send(msg);
```

---

## 📋 Quick Reference

### Get OTP Code
```
Check backend terminal for: 📧 OTP for email: XXXXXX
```

### Verify OTP
```
POST /api/auth/verify-otp
{
  "email": "sujalpatne583@gmail.com",
  "otp": "745147"
}
```

### Response
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { ... }
}
```

---

## ✅ What's Working

- ✅ Registration endpoint
- ✅ OTP generation
- ✅ OTP storage
- ✅ OTP verification
- ✅ Token generation
- ✅ User creation

---

## 🎯 Next Steps

1. **Check backend logs for OTP code**
2. **Copy the 6-digit code**
3. **Enter OTP on frontend**
4. **Click Verify OTP**
5. **Login with new account**

---

**Status:** ✅ **OTP SYSTEM WORKING IN DEVELOPMENT MODE**

**Note:** OTP is logged to backend console, not sent to email in development.
