import usePosts from '../../hooks/usePosts';
import PostsList from '../../components/PostsList/PostsList';
import './HomePage.css';

const HomePage = () => {
  const { posts } = usePosts();

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">CollectiveIQ</h1>
        <PostsList posts={posts || []} maxPostsPerPage={10} />
    </div>
  );
};

export default HomePage;