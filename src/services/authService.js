import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "users/";

const setAuthToken = (token) => {
    if (token) {
        axios.defaults.headers.common["x-auth-token"] = token;
    } else {
        delete axios.defaults.headers.common["x-auth-token"];
    }
};

const register = (username, email, password) => {
    return axios.post(API_URL + "register", { username, email, password });
};

const login = (email, password) => {
    return axios.post(API_URL + "login", { email, password });
};

const getCurrentUser = () => {
    return axios.get(API_URL + "me");
};

export default {
    register,
    login,
    getCurrentUser,
    setAuthToken,
};
