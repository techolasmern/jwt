import bcrypt from "bcrypt";
import { generateAccessToken } from "../lib/jwt.mjs";
import { UserModel } from "../models/user.model.mjs";

const create_user = async (request, response) => {
    try {
        const body = request.body;
        body.password = await bcrypt.hash(body.password, 10);
        const res = await UserModel.create(body);
        if (!res) {
            return response.status(400).send({ message: "User creation failed" });
        }
        response.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error)
        response.status(500).json({ message: "Internal server error" });
    }
}

const user_login = async (request, response) => {
    try {
        const body = request.body;
        const user = await UserModel.findOne({ username: body.username });
        if (!user) {
            return response.status(404).json({ message: "User not found" });
        }
        const passwordMatch = await bcrypt.compare(body.password, user.password);
        if (!passwordMatch) {
            return response.status(401).json({ message: "Password is incorrect" });
        }
        const accessToken = generateAccessToken(user);
        response.status(200).json({ accessToken });
    } catch (error) {
        response.status(500).json({ message: "Internal server error" });
    }
}

const check = async (request, response) => {
    return response.status(200).json({ message: "Access granted" });
}

export default {
    create_user,
    user_login,
    check
}