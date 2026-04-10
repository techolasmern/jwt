import "dotenv/config";
import jwt from "jsonwebtoken"

export const generateAccessToken = (user) => {
    return jwt.sign({ ...user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
}

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        throw error;
    }
}