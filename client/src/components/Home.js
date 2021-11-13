import React, { useState, useEffect } from "react";
import PostService from "../services/post.service";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    PostService.getAllPublicPosts().then(
      (response) => {
        setPosts(response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <div>
      <h3>
        {posts.map((post, index) => (
          <div key={index}>{post.content}</div>
        ))}
      </h3>
    </div>
  );
};

export default Home;
