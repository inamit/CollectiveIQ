import PostsList from '../../components/PostsList/PostsList';
import './HomePage.css';
import { usePostsContext } from "../../context/postsContext";

const HomePage = () => {
  const { filteredPosts } = usePostsContext();
  
  return (
      <div className="homepage-container">
        <h1 className="homepage-title">CollectiveIQ</h1>
        <PostsList posts={filteredPosts || []} maxPostsPerPage={3} />
      </div>
  );
};

export default HomePage;