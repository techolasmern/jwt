import axios from "axios";
import { storage } from "./storage";

export const api = axios.create({
    baseURL: "http://localhost:8080"
});

api.interceptors.request.use((config) => {
    const token = storage.get();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})