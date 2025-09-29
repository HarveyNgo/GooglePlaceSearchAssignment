import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '../config/google';

const instance = axios.create({
  baseURL: 'https://places.googleapis.com/v1/',
  timeout: 20_000,
  headers: {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
  },
});

export default instance;
