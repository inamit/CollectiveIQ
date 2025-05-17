import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { routes } from "../../router/routes.ts";
import { PostsService } from "../../services/postsService.ts";
import { useUser } from "../../context/userContext.tsx";
import AppTextField from "../../components/TextField/TextField.tsx";
import { ImagePicker } from "../../components/ImagePicker/ImagePicker.tsx";
import MarkdownEditor from "../../components/Markdown/MarkdownEditor/MarkdownEditor.tsx";
import "./CreatePost.css";
import { Button } from "@mui/material";
import { usePostsContext } from "../../context/postsContext.tsx";
import Post from "../../models/post.ts";
import PostsList from "../../components/PostsList/PostsList.tsx";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [similarPosts, setSimilarPosts] = useState<Post[]>([]);
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const { reloadPosts } = usePostsContext();

  const handleCancel = () => {
    setTitle("");
    setQuestion("");
    setImage(null);
    navigate(routes.HOME);
  };

  useEffect(() => {
    let cancelRequest: () => void;

    const timeout = setTimeout(() => {
      if (title || question) {
        const postService = new PostsService(user!, setUser);
        const { request, cancel } = postService.getSimilarPosts(
          title,
          question
        );

        cancelRequest = cancel;
        request
          .then((response) => {
            setSimilarPosts(response.data);
          })
          .catch((err) => {
            console.error(err);
          });
      } else if (similarPosts.length > 0) {
        setSimilarPosts([]);
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
      if (cancelRequest) {
        cancelRequest();
      }
    };
  }, [title, question]);

  const handleAddPost = async (e: any) => {
    e.preventDefault();
    const postService = new PostsService(user!, setUser);

    const { request } = postService.saveNewPost(title, question, image);

    request
      .then((response) => {
        reloadPosts();
        navigate(`${routes.POST}/${response.data._id}`);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div className="question-container">
      <h2>Ask a question</h2>
      <p className="description">
        Ask a question, or share your knowledge with others
      </p>
      <form>
        <div className="field-container">
          <label htmlFor="title" className="field-label">
            Title
          </label>
          <AppTextField
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            placeholder="Enter a title"
          />
        </div>

        <div className="field-container">
          <label htmlFor="question" className="field-label">
            What's your question?
          </label>

          <MarkdownEditor
            content={question}
            handleInputChange={(_, content) => setQuestion(content)}
          />
        </div>

        <ImagePicker image={image} setImage={setImage} required={false} />

        {similarPosts.length > 0 && (
          <div className="similar-posts">
            <h3>
              Take a look at these similar posts before asking your question
            </h3>
            <PostsList posts={similarPosts || []} maxPostsPerPage={5} />
          </div>
        )}
        <div className="button-container">
          <Button
            type="submit"
            onClick={handleAddPost}
            className="submit-button"
            color="primary"
            variant="contained"
          >
            Ask
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            color="secondary"
            variant="contained"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
