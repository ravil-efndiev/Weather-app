import axios from "axios";

const weatherApi = axios.create({
  baseURL: 'https://api.tomorrow.io/v4/weather/',
  params: {
    apikey: import.meta.env.VITE_TOMORROW_API_KEY,
  },
});

export default weatherApi;
