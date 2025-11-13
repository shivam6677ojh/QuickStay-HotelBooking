import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || process.env.SMPT_USER, // Support both spellings
        pass: process.env.SMTP_PASS || process.env.SMPT_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Verify transporter configuration
transporter.verify(function (error, success) {
    if (error) {
        console.error('❌ Nodemailer configuration error:', error.message);
    } else {
        console.log('✅ Email server is ready to send messages');
    }
});

export default transporter