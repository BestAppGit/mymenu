import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.mymenu.best:8004/'
});

export default api;