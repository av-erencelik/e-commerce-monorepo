import { env } from '../../env.mjs';
import axios from 'axios';

const api = axios.create({
  baseURL: env.NEXT_PUBLIC_NX_API_URL,
  withCredentials: true,
});

api.defaults.headers.common['Content-Type'] = 'application/json';

export default api;
