import axios from "axios";

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || "" ) + "/api",
});

console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);