// src/api/client.js — Axios instance configuration
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL,
  timeout: 25000, // 25s timeout as per spec
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;
