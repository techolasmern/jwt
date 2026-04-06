import { verifyAccessToken } from "../lib/jwt.mjs";

export const authMid = async (request, response, next) => {
    const tokenString = request.headers.authorization;
    if(!tokenString) {
        return response.status(401).json({ message: "No token provided" });
    }
    const [type, token] = tokenString.split(" ");
    if(type !== "Bearer") {
        return response.status(401).json({ message: "Invalid token type" });
    }
    try {
        verifyAccessToken(token);
        next();
    } catch (error) {
        return response.status(401).json({ message: "Invalid token" });
    }
}