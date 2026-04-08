import { OTPModel } from "../models/otp.model.mjs";
import { sendOtpToMail } from "../services/nodemailer.service.mjs";

const send = async (request, response) => {
    try {
        const { mail } = request.body;
        console.log(mail)
        if(!mail) return response.status(400).send({ message: "Receiver mail is required" });
        // request.session[mail] = {otp: res.otp, cooldown: Date.now() + 1000 * 20 };
        const otp = await OTPModel.findOne({ mail });
        if (!otp) {
            const res = await sendOtpToMail(mail);
            if (!res) return response.status(400).send({ message: "OTP sending failed." });
            const new_otp = await OTPModel.create({ mail, value: res.otp, cooldown: Math.floor(Date.now() / 1000) + 60, expire: Math.floor(Date.now() / 1000) + 300 });
            if(!new_otp) return response.status(500).send({ message: "OTP sending failed." });
        } else{
            if(otp.cooldown > Math.floor(Date.now() / 1000)) return response.status(400).send({ message: `Please wait ${Math.floor((otp.cooldown - Math.floor(Date.now() / 1000)))} seconds before sending another OTP.` });
            const res = await sendOtpToMail(mail);
            if (!res) return response.status(400).send({ message: "OTP sending failed." });
            otp.value = res.otp;
            otp.cooldown = Math.floor(Date.now() / 1000) + 60;
            otp.expire = Math.floor(Date.now() / 1000) + 300;
            await otp.save();
        }
        return response.status(200).send({ message: "OTP sent successfully." });
    } catch (err) {
        return response.status(500).send({ message: err?.message || "Internal Server Error" });
    }
}

const verify = async (request, response) => {
    try {
        const { mail, otp } = request.body;
        if (!mail || !otp) return response.status(400).send({ message: "Mail and OTP are required" });
        const otp_data = await OTPModel.findOne({ mail });
        if (!otp_data) return response.status(404).send({ message: "Please send OTP first." });
        const sent_otp = otp_data.value;
        if(otp_data.expire < Math.floor(Date.now() / 1000)) return response.status(400).send({ message: "Expired OTP" });
        if(sent_otp != otp) return response.status(400).send({ message: "Invalid OTP" });
        return response.status(200).send({ message: "OTP verified successfully" });
    } catch (err) {
        return response.status(500).send({ message: err?.message || "Internal Server Error" });
    }
}

const resend = async (request, response) => {
    try {
        const { mail } = request.body;
        if (!mail) return response.status(400).send({ message: "Receiver mail is required" });
        const session = request.session;
        if(!session?.[mail]) return response.status(404).send({ message: "You haven't sent OTP to this mail." });
        const current_time = Date.now();
        const cooldown = session[mail]?.cooldown;
        if (current_time < cooldown) return response.status(400).send({ message: `Please wait ${Math.floor((cooldown - current_time) / 1000)} seconds before sending another OTP.`})
        await send(request, response);
    } catch (err) {
        return response.status(500).send({ message: err?.message || "Internal Server Error" });
    }
}

export default { send, verify, resend }