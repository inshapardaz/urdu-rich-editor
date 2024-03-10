import {useEffect, useCallback} from 'react';
// ------------------------------------------------------
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  COMMAND_PRIORITY_LOW,
} from 'lexical';
// ------------------------------------------------------
import { SAVE_COMMAND } from '../commands/saveCommand';
// ------------------------------------------------------
function SavePlugin({ format, onSave = () => {} }) {
  const [editor] = useLexicalComposerContext();

  const saveCallback = useCallback(() => {
    if (format === "markdown") {
      editor.update(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        onSave(markdown);
      });
    } else {
      const editorState = editor.getEditorState();
      const json = editorState.toJSON();
      onSave(json);
    }
  }, [editor, format, onSave]);

  useEffect(() => {
    editor.registerCommand(
      SAVE_COMMAND,
      saveCallback,
      COMMAND_PRIORITY_LOW,
    );

  }, [editor]);

  return null;
}

export default SavePlugin;
