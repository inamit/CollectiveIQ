import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { routes } from "../../router/routes.ts";
import { PostsService } from "../../services/postsService.ts";
import { useUser } from "../../context/userContext.tsx";
import AppTextField from "../../components/TextField/TextField.tsx";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import "./CreatePost.css";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const handleImageUpload = (e: any) => {
    setImage(e.target.files[0]);
  };

  const handleCancel = () => {
    setTitle("");
    setQuestion("");
    setImage(null);
    navigate(routes.USER_PROFILE);
  };

  const handleAddPost = async (e: any) => {
    e.preventDefault();
    console.log("Title:", title);
    console.log("Question:", question);
    console.log("Pic:", image);
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

        {image ? (
          <div>
            <label
              htmlFor="imagePreview"
              style={{
                display: "block",
                fontSize: "14px",
                color: "#bbb",
                marginBottom: "8px",
                textAlign: "left",
              }}
            >
              Upload Image:
            </label>
            <div className="imageContainer">
              <img
                id="imagePreview"
                style={{ height: 400, width: 400 }}
                src={URL.createObjectURL(image)}
              />
              <div className="imageOverlay">
                <IconButton aria-label="delete" onClick={() => setImage(null)}>
                  <DeleteIcon sx={{ color: "red" }} />
                </IconButton>
              </div>
            </div>
          </div>
        ) : (
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
          >
            Upload Image (optional)
            <input
              type="file"
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
          </Button>
        )}
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

export default AskQuestion;
