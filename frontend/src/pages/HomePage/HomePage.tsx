import PostsList from "../../components/PostsList/PostsList";
import "./HomePage.css";
import { usePostsContext } from "../../context/postsContext";
import { useEffect } from "react";

const HomePage = () => {
  const { filteredPosts, reloadPosts } = usePostsContext();

  useEffect(() => {
    reloadPosts();
  }, []);

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">CollectiveIQ</h1>
      <PostsList posts={filteredPosts || []} maxPostsPerPage={3} />
    </div>
  );
};

export default HomePage;
