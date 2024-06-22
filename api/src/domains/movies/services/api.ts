import axios from 'axios';
import { getEnv } from '../../../../utils/functions/get-env';

const api = axios.create({
    baseURL: getEnv('TMDB_BASE_URL'),
    headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${getEnv('TMDB_API_KEY')}`
    }
});

export default api;