import twilio from "twilio";

// Initialize Twilio client
const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send OTP via SMS
 */
export const sendSmsOTP = async (phone: string, otp: string) => {
    try {
        console.log(`📱 Sending SMS OTP to: ${phone}`);
        
        const message = await client.messages.create({
            body: `Your OTP for login is: ${otp}. Valid for 10 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });

        console.log("✅ SMS sent successfully:", message.sid);
        return true;
    } catch (error: any) {
        console.error("❌ Error sending SMS:", error.message);
        throw new Error(`Failed to send SMS: ${error.message}`);
    }
};
