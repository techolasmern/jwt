import { transporter } from "../config/nodemailer.config.mjs";
import fs from "fs";
import "dotenv/config";
import { generateOTP } from "./otp.service.mjs";

export const sendEmail = async (to, otp) => {
    try {
        const html = fs.readFileSync("./public/mail.html", { encoding: "utf-8" });
        const mailingOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: "Test Email",
            text: `Your 4-digit OTP is ${otp}`
        }
        const info = await transporter.sendMail(mailingOptions);
        return info
    } catch (error) {
        return null;  
    }
}

export const sendOtpToMail = async (receiver_mail) => {
    try {
        const otp = generateOTP(6);
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: receiver_mail,
            subject: "OTP Verification",
            html: `<b>Your 6-digit OTP is:</b> <code>${otp}</code>`
        }
        const info = await transporter.sendMail(mailOptions);
        return { ok: true, messageId: info?.messageId, otp };
    } catch (err) {
        return null;
    }
}