import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true, // IMPORTANT: This sends the JWT cookie automatically!
});