import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertCodeBlock,
  InsertFrontmatter,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  Separator,
  ShowSandpackInfo,
  StrikeThroughSupSubToggles,
  UndoRedo,
  ViewMode,
} from "@mdxeditor/editor";

export default function MarkdownToolbar({
  hasDiffSource,
}: {
  hasDiffSource: boolean;
}) {
  const diffSourceOptions: ViewMode[] = ["rich-text", "source"];

  if (hasDiffSource) {
    diffSourceOptions.push("diff");
  }
  return (
    <DiffSourceToggleWrapper options={diffSourceOptions}>
      <ConditionalContents
        options={[
          {
            when: (editor) => editor?.editorType === "codeblock",
            contents: () => <ChangeCodeMirrorLanguage />,
          },
          {
            when: (editor) => editor?.editorType === "sandpack",
            contents: () => <ShowSandpackInfo />,
          },
          {
            fallback: () => (
              <>
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <StrikeThroughSupSubToggles options={["Strikethrough"]} />
                <CodeToggle />
                <Separator />
                <ListsToggle options={["bullet", "number"]} />
                <Separator />

                <BlockTypeSelect />

                <Separator />

                <CreateLink />

                <Separator />

                <InsertTable />
                <InsertThematicBreak />

                <Separator />
                <InsertCodeBlock />

                <Separator />
                <InsertFrontmatter />
              </>
            ),
          },
        ]}
      />
    </DiffSourceToggleWrapper>
  );
}
