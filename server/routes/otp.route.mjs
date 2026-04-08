import { Router } from "express";
import otpController from "../controllers/otp.controller.mjs";

const otpRouter = Router();

otpRouter.post("/send", otpController.send);
otpRouter.post("/verify", otpController.verify);
otpRouter.post("/resend", otpController.resend);

export default otpRouter;