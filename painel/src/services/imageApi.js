import axios from 'axios';

const imageApi = axios.create({
    baseURL: 'https://api.cloudinary.com/v1_1/debnzbwjv/'
});

export default imageApi;