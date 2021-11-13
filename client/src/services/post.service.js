import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "/posts";

const getAllPublicPosts = () => {
  return axios.get(API_URL + "/public");
};

const getAllPrivatePosts = () => {
  return axios.get(API_URL + "/private", { headers: authHeader() });
};

const postService = {
  getAllPublicPosts,
  getAllPrivatePosts,
};

export default postService;
