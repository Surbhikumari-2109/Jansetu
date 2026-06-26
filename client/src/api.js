import axios from 'axios';

const API = axios.create({
  baseURL: 'https://jansetu-eta0.onrender.com', // for frontend deploy
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;