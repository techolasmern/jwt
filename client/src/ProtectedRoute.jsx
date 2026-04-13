import { Navigate } from "react-router";
import { storage } from "./lib/storage"
import { jwtDecode } from "jwt-decode";

export const ProtectedRoute = ({ children, is_auth }) => {
    const token = storage.get();
    if (!token) {
        if (is_auth) return children;
        return <Navigate to={"/auth"} />
    }
    try {
        const decoded = jwtDecode(token);
        const current_time = Math.floor(Date.now() / 1000);
        const expire_time = decoded.exp;
        if (current_time > expire_time) {
            if(is_auth) return children;
            storage.remove();
            return <Navigate to={"/auth"} />
        }
        if(is_auth) return <Navigate to={"/dashboard"} />
        return children;
    } catch (e) {
        if (is_auth) return children;
        storage.remove();
        return <Navigate to={"/auth"} />
    }
}