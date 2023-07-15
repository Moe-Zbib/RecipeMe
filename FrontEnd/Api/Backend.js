import axios from "axios";

const backendUrl = "http://192.168.1.6:8000"; // Update with your backend URL

const api = axios.create({
  baseURL: backendUrl,
});

export default api;
