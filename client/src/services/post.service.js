import api from "./api";
// import axios from "axios";
// import authHeader from "./auth-header";

// const API_URL = "/posts";

const getAllPublicPosts = () => {
  return api.get("/posts/public");
};

// const getAllPrivatePosts = () => {
//   return axios.get(API_URL + "/private", { headers: authHeader() });
// };
const getAllPrivatePosts = () => {
  return api.get("/posts/private");
};

const postService = {
  getAllPublicPosts,
  getAllPrivatePosts,
};

export default postService;
