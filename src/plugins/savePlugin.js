import { useEffect, useCallback } from "react";
// ------------------------------------------------------
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { COMMAND_PRIORITY_LOW } from "lexical";
// ------------------------------------------------------
import { SAVE_COMMAND } from "../commands/saveCommand";
// ------------------------------------------------------
function SavePlugin({ format, onSave }) {
  const [editor] = useLexicalComposerContext();

  const saveCallback = useCallback(() => {
    if (format === "markdown") {
      editor.update(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        if (onSave) {
          onSave(markdown);
        }
      });
    } else {
      const editorState = editor.getEditorState();
      const json = editorState.toJSON();
      if (onSave) {
        onSave(json);
      }
    }
  }, [format, onSave]);

  useEffect(() => {
    if (editor._commands.has(SAVE_COMMAND)) {
      editor._commands.delete(SAVE_COMMAND);
    }
    editor.registerCommand(SAVE_COMMAND, saveCallback, COMMAND_PRIORITY_LOW);
  }, [editor, format, saveCallback]);

  return null;
}

export default SavePlugin;
