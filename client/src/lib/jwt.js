import { jwtDecode } from "jwt-decode";
import { storage } from "./storage";

export const getUserId = () => {
    const token = storage.get();
    const decoded = jwtDecode(token);
    return decoded._doc._id;
}