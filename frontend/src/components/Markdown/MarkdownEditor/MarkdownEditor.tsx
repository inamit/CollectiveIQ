import {
  MDXEditor,
  toolbarPlugin,
  listsPlugin,
  quotePlugin,
  headingsPlugin,
  linkPlugin,
  linkDialogPlugin,
  tablePlugin,
  thematicBreakPlugin,
  frontmatterPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  markdownShortcutPlugin,
} from "@mdxeditor/editor";
import MarkdownToolbar from "../MarkdownToolbar/MarkdownToolbar";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import MarkdownText from "../MarkdownText/MarkdownText";
import "@mdxeditor/editor/style.css";
import "./MarkdownEditor.css";

enum Mode {
  PREVIEW = "preview",
  EDIT = "edit",
}

export default function MarkdownEditor({
  content,
  previousContent,
  handleInputChange,
}: {
  content: string;
  previousContent?: string;
  handleInputChange: (field: string, value: string) => void;
}) {
  const [mode, setMode] = useState(Mode.EDIT);

  return (
    <div className="markdown-editor">
      <ToggleButtonGroup
        color="primary"
        sx={{ backgroundColor: "#3D404A" }}
        value={mode}
        exclusive
        onChange={(_, value) => setMode(value)}
        aria-label="editor mode"
      >
        <ToggleButton value={Mode.PREVIEW} aria-label="preview">
          <VisibilityIcon />
        </ToggleButton>
        <ToggleButton value={Mode.EDIT} aria-label="edit">
          <EditIcon />
        </ToggleButton>
      </ToggleButtonGroup>

      {mode === Mode.PREVIEW ? (
        <MarkdownText className="markdown-preview" content={content} />
      ) : (
        <MDXEditor
          className="dark-theme dark-editor"
          markdown={content}
          onChange={(editedMarkdown) =>
            handleInputChange("content", editedMarkdown)
          }
          plugins={[
            toolbarPlugin({
              toolbarContents: () => (
                <MarkdownToolbar
                  hasDiffSource={previousContent ? true : false}
                />
              ),
            }),
            listsPlugin(),
            quotePlugin(),
            headingsPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            tablePlugin(),
            thematicBreakPlugin(),
            frontmatterPlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                js: "JavaScript",
                css: "CSS",
                txt: "text",
                tsx: "TypeScript",
                java: "Java",
                sql: "SQL",
              },
              autoLoadLanguageSupport: true,
            }),
            diffSourcePlugin({
              viewMode: "rich-text",
              diffMarkdown: previousContent,
            }),
            markdownShortcutPlugin(),
          ]}
        />
      )}
    </div>
  );
}
