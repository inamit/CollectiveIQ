import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../router/routes.ts";
import { PostsService } from "../../services/postsService.ts";
import { useUser } from "../../context/userContext.tsx";
import AppTextField from "../../components/TextField/TextField.tsx";
import { ImagePicker } from "../../components/ImagePicker/ImagePicker.tsx";
import MarkdownEditor from "../../components/Markdown/MarkdownEditor/MarkdownEditor.tsx";
import "./CreatePost.css";
import { Button } from "@mui/material";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleCancel = () => {
    setTitle("");
    setQuestion("");
    setImage(null);
    navigate(routes.HOME);
  };

  const handleAddPost = async (e: any) => {
    e.preventDefault();
    const postService = new PostsService(user!, setUser);

    const { request } = postService.saveNewPost(title, question, image);

    request
      .then((response) => {
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
        Get answers from AI models, or share your knowledge with others
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
