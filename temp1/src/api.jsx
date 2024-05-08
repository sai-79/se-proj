// api.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5001", // Update this URL with your backend server's URL
});

export default instance;
