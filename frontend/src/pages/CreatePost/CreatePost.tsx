import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../router/routes.ts";
import { PostsService } from "../../services/postsService.ts";
import { useUser } from "../../context/userContext.tsx";
import AppTextField from "../../components/TextField/TextField.tsx";
import { ImagePicker } from "../../components/ImagePicker/ImagePicker.tsx";

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
    navigate(routes.USER_PROFILE);
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
    <div style={{ maxWidth: "600px", margin: "0 auto", color: "#fff" }}>
      <h2>Ask a question</h2>
      <p style={{ marginBottom: "20px", color: "#bbb" }}>
        Get answers from AI models, or share your knowledge with others
      </p>
      <form>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="title"
            style={{
              display: "block",
              fontSize: "14px",
              color: "#bbb",
              marginBottom: "8px",
              textAlign: "left",
            }}
          >
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

        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="question"
            style={{
              display: "block",
              fontSize: "14px",
              color: "#bbb",
              marginBottom: "8px",
              textAlign: "left",
            }}
          >
            What's your question?
          </label>
          <AppTextField
            multiline
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            fullWidth
            rows={10}
            placeholder="Type your question here"
          />
        </div>

        <ImagePicker image={image} setImage={setImage} required={false} />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            type="submit"
            onClick={handleAddPost}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              backgroundColor: "#617AFA",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Ask
          </button>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              backgroundColor: "#41424C",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
