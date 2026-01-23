import twilio from "twilio";

/**
 * Send OTP via Twilio SMS
 */
export const sendSmsOTP = async (phone: string, otp: string) => {
  // Validate env INSIDE function (safe)
  if (
    !process.env.TWILIO_ACCOUNT_SID ||
    !process.env.TWILIO_AUTH_TOKEN ||
    !process.env.TWILIO_PHONE_NUMBER
  ) {
    throw new Error("Twilio environment variables are missing");
  }

  // Twilio client
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  // Ensure E.164 format
  if (!phone.startsWith("+")) {
    throw new Error(
      "Phone number must be in E.164 format (e.g. +919876543210)"
    );
  }

  try {
    console.log(`📱 Sending OTP to ${phone}`);

    const message = await client.messages.create({
      body: `Your OTP for login is ${otp}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    console.log("✅ SMS sent. SID:", message.sid);
    return true;

  } catch (error: any) {
    console.error("❌ Twilio Error:", {
      message: error.message,
      code: error.code
    });
    throw new Error("Failed to send OTP via SMS");
  }
};
