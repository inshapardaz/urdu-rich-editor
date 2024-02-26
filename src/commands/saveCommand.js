import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  COMMAND_PRIORITY_LOW,
  createCommand,
} from 'lexical';
import {useEffect} from 'react';

export const SAVE_COMMAND = createCommand('SAVE_COMMAND');

export function SavePlugin({ onSave = () => {} }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.registerCommand(
      SAVE_COMMAND,
      () => {
        console.log('save command fired');
        onSave(editor.getEditorState());
      },
      COMMAND_PRIORITY_LOW,
    );

  }, [editor]);

  return null;
}
