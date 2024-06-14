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

// const fetchData = async (endpoint, method = 'get', data = null) => {
//   try {
//     const response = await axiosInstance({
//       url: endpoint,
//       method,
//       data
//     });
//     return response.data;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

const fetchData = async (endpoint, method = 'get', data = null) => {
  try {
    const response = await axiosInstance({
      url: endpoint,
      method,
      data
    });
    return response.data;
  } catch (error) {
        if (error.response) {
            // Request made and server responded with a status code
            // that falls out of the range of 2xx
            console.error('Axios error response data:', error.response.data);
            throw error.response.data;  // Pass the error response data
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Axios error request:', error.request);
            throw new Error('No response received from server.');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Axios error message:', error.message);
            throw new Error(error.message);
        }
    }
};


export default fetchData;
