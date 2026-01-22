import nodemailer from "nodemailer";

// Log configuration on startup
console.log("📧 Email Configuration Loaded:");
console.log("HOST:", process.env.EMAIL_HOST);
console.log("PORT:", process.env.EMAIL_PORT);
console.log("USER:", process.env.EMAIL_USER);

/**
 * Create transporter dynamically to ensure .env is loaded
 */
function getTransporter() {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || "587"),
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
}

/**
 * Send OTP Email
 */
export const sendOTPEmail = async (email: string, otp: string) => {
    try {
        console.log(`📨 Sending OTP email to: ${email}`);
        const transporter = getTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for Login",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Login Verification</h2>
                    <p style="color: #555; font-size: 16px;">Hi,</p>
                    <p style="color: #555; font-size: 16px;">Your OTP for login is:</p>
                    <div style="background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #007bff; letter-spacing: 5px; margin: 0;">${otp}</h1>
                    </div>
                    <p style="color: #999; font-size: 14px;">This OTP is valid for 10 minutes.</p>
                    <p style="color: #999; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    <p style="color: #999; font-size: 12px;">© 2026 Your Company. All rights reserved.</p>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.messageId);
        return true;
    } catch (error: any) {
        console.error("❌ Error sending email:", error.message);
        throw new Error(`Failed to send OTP email: ${error.message}`);
    }
};

/**
 * Send Welcome Email
 */
export const sendWelcomeEmail = async (email: string, name: string) => {
    try {
        console.log(`📨 Sending welcome email to: ${email}`);
        const transporter = getTransporter();
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to Our Platform",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome, ${name}!</h2>
                    <p style="color: #555; font-size: 16px;">Thank you for registering with us.</p>
                    <p style="color: #555; font-size: 16px;">Your account is now active and ready to use.</p>
                    <p style="color: #555; font-size: 16px;">If you have any questions, feel free to contact us.</p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    <p style="color: #999; font-size: 12px;">© 2026 Your Company. All rights reserved.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log("✅ Welcome email sent successfully");
        return true;
    } catch (error: any) {
        console.error("❌ Error sending welcome email:", error.message);
        throw new Error(`Failed to send welcome email: ${error.message}`);
    }
};
