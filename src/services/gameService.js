import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL + "game/";

const getRandomText = (params) => {
    return axios.get(API_URL + "text/random", { params });
};

export default {
    getRandomText,
};
