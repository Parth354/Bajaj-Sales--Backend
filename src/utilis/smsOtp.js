import  {asyncHandler}  from "./asyncHandler.js";
import Twilio from "twilio";

const accountSid = "AC202d173fb2bab5dda878a606ab346909";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = Twilio(accountSid, authToken);

const smsotp = asyncHandler(async(req,res)=> {
    const { phoneNo }=req.body
        try {
        const verification = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
            .verifications
            .create({ to:`+91${phoneNo}`, channel: "sms" });

        res.json({ success: true, verificationSid: verification.sid });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Failed to send OTP" });
    }
})

export default smsotp