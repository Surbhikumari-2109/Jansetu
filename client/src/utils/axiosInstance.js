import axios from 'axios';

const API = axios.create({
  // Yeh environment variable Vercel se live URL uthayega
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://jansetu-eta0.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// // Optional: Agar localStage se token bhejte waqt header attach karna ho
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default API;