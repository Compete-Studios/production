import axios from 'axios';
import { auth } from "../firebase/firebase";

const API_BASE_URL = "http://localhost:3333/api";
// const API_BASE_URL = 'https://amazing-dubinsky.209-59-154-172.plesk.page/api'

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  const token = user && (await user.getIdToken());
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const fetchData = async (endpoint, method = 'get', data = null) => {
  try {
    const response = await axiosInstance({
      url: endpoint,
      method,
      data
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default fetchData;
