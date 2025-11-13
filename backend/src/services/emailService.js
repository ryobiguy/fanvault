import pkg from 'nodemailer';
const nodemailer = pkg;

// Create transporter
// For development, we'll use a test account from Ethereal
// For production, you'll need to configure with SendGrid, AWS SES, etc.
let transporter;

async function createTransporter() {
  if (process.env.NODE_ENV === 'production' && process.env.SENDGRID_API_KEY) {
    // Production: Use SendGrid
    transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY
      }
    });
  } else {
    // Development: Use Ethereal test account
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('📧 Using Ethereal test email account');
  }
}

// Initialize transporter
createTransporter();

async function sendVerificationEmail(email, displayName, verificationToken) {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
  
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"DirectFans" <noreply@directfans.me>',
    to: email,
    subject: 'Verify Your DirectFans Email',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ec4899 0%, #f97316 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f97316 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to DirectFans! 🎉</h1>
          </div>
          <div class="content">
            <p>Hi ${displayName},</p>
            <p>Thanks for signing up! We're excited to have you join our community.</p>
            <p>Please verify your email address by clicking the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #6b7280; font-size: 14px;">${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't create an account with DirectFans, you can safely ignore this email.</p>
          </div>
          <div class="footer">
            <p>© 2024 DirectFans. All rights reserved.</p>
            <p>Keep 100% of your earnings • £10/month subscription</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    
    // In development, log the preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Verification email sent!');
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

export { sendVerificationEmail };
