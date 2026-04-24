import axios from "axios";

const API = axios.create({
  baseURL: "https://dsa-checklist.onrender.com/api",
});

export default API;