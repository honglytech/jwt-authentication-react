import Axios from "axios";

const API_URL = "/auth";

const signup = (email, password) => {
  Axios.defaults.withCredentials = true;
  return Axios.post("http://localhost:5000" + API_URL + "/signup", {
    email,
    password,
  }).then((response) => {
    if (response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  });
};

const checkLoginChallenge = (challenge) => {
  return Axios.post(API_URL + "/login", {
    challenge,
  }).then((response) => {
    if (response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getChallenge = () => {
  return Axios.get(API_URL + "/challenge");
};

const authService = {
  signup,
  checkLoginChallenge,
  logout,
  getCurrentUser,
  getChallenge,
};

export default authService;
