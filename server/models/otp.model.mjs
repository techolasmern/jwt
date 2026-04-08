import mongoose from "mongoose";

const schema = new mongoose.Schema({
    mail: {
        type: String,
        required: true
    },
    value: {
        type: Number
    },
    cooldown: {
        type: Number
    },
    expire: {
        type: Number
    }
}, { timestamps: true });

export const OTPModel = mongoose.model("otps", schema);

