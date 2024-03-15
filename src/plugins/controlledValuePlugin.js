import React, { useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $convertFromMarkdownString, $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";

export const ControlledValuePlugin = ({ value, onChange, isRichtext, format }) => {
  useAdoptPlaintextValue(value, isRichtext, format);

  const handleChange = (editorState, editor) => {
    editorState.read(() => {
      if (format === "markdown") {
        editor.update(() => {
          const markdown = $convertToMarkdownString(TRANSFORMERS);
          if (onChange) {
            onChange(markdown);
          }
        });
      } else {
        const editorState = editor.getEditorState();
        const json = editorState.toJSON();
        if (onChange) {
          onChange(json);
        }
      }
    });
  };

  return <OnChangePlugin onChange={handleChange} />;
};

export const useAdoptPlaintextValue = (value, isRichText, format) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (value)
    {
      if (isRichText)
      {
        editor.update(() => {
          if (format === "markdown") {
            $convertFromMarkdownString(value, TRANSFORMERS);
          } else {
            const editorState = editor.parseEditorState(value)
            editor.setEditorState(editorState);
          }
        });
     }
     else {
        // TODO: implement plain text updates
     }
    }
  }, [editor, value]);
};
