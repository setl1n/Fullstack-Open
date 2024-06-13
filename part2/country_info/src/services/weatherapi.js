import axios from "axios";
const baseurl = "https://api.openweathermap.org/data/3.0/onecall?";
const api_key = import.meta.env.VITE_api_key;

const getWeatherInfo = (async (lat , lng) => {
    let response = await axios.get(`${baseurl}lat=${lat}&lon=${lng}&appid=${api_key}`);
    return response.data;
})

export default {getWeatherInfo}