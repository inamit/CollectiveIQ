import Post from "../../models/post";
import MarkdownEditor from "./MarkdownEditor/MarkdownEditor";
import MarkdownText from "./MarkdownText/MarkdownText";

interface MarkdownProps {
  editablePost: Post;
  post?: Post;
  handleInputChange: (field: string, value: string) => void;
  isEditing: boolean;
}

export default function Markdown({
  editablePost,
  post,
  handleInputChange,
  isEditing,
}: MarkdownProps) {
  return isEditing ? (
    <MarkdownEditor
      content={editablePost?.content}
      previousContent={post?.content}
      handleInputChange={handleInputChange}
    />
  ) : (
    <MarkdownText content={editablePost?.content} />
  );
}
