import  {asyncHandler}  from "./asyncHandler.js";
import Twilio from "twilio";

const accountSid = "AC202d173fb2bab5dda878a606ab346909";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = Twilio(accountSid, authToken);

const verifyOTP = asyncHandler(async (req, res) => {
    const { OTP,phoneNo } = req.body;
    try {
        const verificationCheck = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verificationChecks
            .create({ to: `+91${phoneNo}`, code: OTP });

        if (verificationCheck.status === "approved") {
            res.json({ success: true, message: "OTP verified successfully" });
        } else {
            res.json({ success: false, message: "Invalid OTP" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to verify OTP" });
    }
});

export default verifyOTP;