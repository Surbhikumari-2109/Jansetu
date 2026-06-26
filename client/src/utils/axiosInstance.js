import axios from 'axios';

const API = axios.create({
  baseURL: 'https://jansetu-eta0.onrender.com', // Direct live URL taaki koi confusion na bache
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;