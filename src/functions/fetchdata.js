import axios from 'axios';
import { auth } from "../firebase/firebase";
import { REACT_API_BASE_URL } from '../constants';



const axiosInstance = axios.create({
  baseURL: REACT_API_BASE_URL,
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
