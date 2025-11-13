# Email Configuration Guide

## Overview
QuickStay uses Nodemailer with Brevo (formerly Sendinblue) SMTP to send booking confirmation and cancellation emails.

## Setup Instructions

### 1. Create a Brevo Account
1. Go to [Brevo](https://www.brevo.com/) (formerly Sendinblue)
2. Sign up for a free account
3. Verify your email address

### 2. Get SMTP Credentials
1. Log in to your Brevo dashboard
2. Go to **Settings** → **SMTP & API**
3. Copy your **SMTP credentials**:
   - SMTP Server: `smtp-relay.brevo.com`
   - Port: `587`
   - Login: Your SMTP login email
   - Password: Your SMTP password (Master Password)

### 3. Configure Environment Variables
In your `server/.env` file, add:

```env
SENDER_EMAIL=your-verified-email@example.com
SMTP_USER=your_brevo_smtp_login
SMTP_PASS=your_brevo_smtp_password
```

**Important Notes:**
- `SENDER_EMAIL` must be a verified sender in your Brevo account
- Use the SMTP login (not your account email) for `SMTP_USER`
- Use the Master Password for `SMTP_PASS`

### 4. Verify Sender Email
1. In Brevo dashboard, go to **Senders** → **Add a Sender**
2. Add and verify the email you want to use as `SENDER_EMAIL`
3. Follow the verification steps (click link in verification email)

## Features

### Booking Confirmation Email
Sent automatically when a user creates a booking with:
- Hotel name and location
- Room type
- Check-in/Check-out dates
- Number of guests
- Total price

### Booking Cancellation Email
Sent automatically when a user cancels a booking with:
- Cancelled booking details
- Refund information reminder
- Support contact information

## How It Works

1. **User Authentication**: System fetches user email from either:
   - MongoDB database (if webhook synced)
   - Clerk API (fallback for new users)

2. **Email Sending**: Uses Nodemailer with Brevo SMTP

3. **Error Handling**: 
   - Emails failures are logged but don't block booking operations
   - Useful console logs for debugging

## Troubleshooting

### Emails Not Sending?

**Check 1: Environment Variables**
```bash
# In server directory
echo $SENDER_EMAIL
echo $SMTP_USER
echo $SMTP_PASS
```

**Check 2: Brevo Account Status**
- Ensure your account is active
- Check daily sending limits (300/day for free tier)
- Verify sender email is confirmed

**Check 3: Server Logs**
Look for these messages:
```
✅ Email server is ready to send messages
✅ Booking confirmation email sent to user@example.com
```

Or error messages:
```
❌ Nodemailer configuration error: [error details]
⚠️  Failed to send confirmation email: [error details]
```

**Check 4: Firewall/Network**
- Ensure port 587 is not blocked
- Test SMTP connection manually if needed

### Common Issues

**Issue**: "Invalid authentication"
- **Solution**: Verify SMTP_USER and SMTP_PASS are correct
- Use Brevo Master Password, not account password

**Issue**: "Sender not verified"
- **Solution**: Verify the sender email in Brevo dashboard

**Issue**: "Daily limit exceeded"
- **Solution**: Upgrade Brevo plan or wait for daily reset

**Issue**: "User email not available"
- **Solution**: 
  - Check Clerk webhook is configured
  - Verify webhook secret is correct
  - User might need to sign out and sign in again

## Testing Emails

You can test email sending by:

1. Create a test booking
2. Check server console for logs
3. Check user's inbox (and spam folder)
4. Verify email content and formatting

## Alternative SMTP Providers

You can use other SMTP providers by updating `server/configs/Nodemailer.js`:

### Gmail
```javascript
host: "smtp.gmail.com",
port: 587,
auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD // Use App Password, not regular password
}
```

### SendGrid
```javascript
host: "smtp.sendgrid.net",
port: 587,
auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY
}
```

### Mailgun
```javascript
host: "smtp.mailgun.org",
port: 587,
auth: {
    user: process.env.MAILGUN_SMTP_LOGIN,
    pass: process.env.MAILGUN_SMTP_PASSWORD
}
```

## Security Best Practices

1. **Never commit `.env` file** to version control
2. **Use strong passwords** for SMTP accounts
3. **Rotate credentials** periodically
4. **Monitor sending logs** for suspicious activity
5. **Use environment-specific credentials** (dev/staging/production)

## Support

If you continue to have issues:
1. Check Brevo status page
2. Review Brevo logs in dashboard
3. Enable debug mode in Nodemailer (see code comments)
4. Contact Brevo support if needed
