import "./ImagePicker.css";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

interface ImagePickerProps {
  image: File | null;
  setImage: (image: File | null) => void;
  required: boolean;
}

export const ImagePicker = ({
  image,
  setImage,
  required,
}: ImagePickerProps) => {
  const handleImageUpload = (e: any) => {
    setImage(e.target.files[0]);
  };

  return image ? (
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
      Upload Image {!required && "(optional)"}
      <input
        required={required}
        type="file"
        style={{ display: "none" }}
        onChange={handleImageUpload}
      />
    </Button>
  );
};
