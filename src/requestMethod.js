import axios from "axios";

const PROXY_URL = "http://localhost:3000/api";

const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const TOKEN = user && JSON.parse(user).token;

// const TOKEN = userInfo?.token;

export const publicRequest = axios.create({
  baseURL: PROXY_URL,
});

export const userRequest = axios.create({
  baseURL: PROXY_URL,
  headers: { token: `Bearer ${TOKEN}` },
});
