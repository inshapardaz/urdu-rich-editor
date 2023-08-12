import { useEffect, useState } from "react";
// ------------------------------------------------------

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

// ------------------------------------------------------
import ToolbarPlugin from "./plugins/toolbar";
// ------------------------------------------------------

const theme = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "editor-paragraph",
};

function onError(error) {
  console.error(error);
}

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

// ------------------------------------------------------

const Editor = ({ placeholder = "Enter some text...", isRichText = false, value, setValue = () => {} }) => {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
  };

  const [editorState, setEditorState] = useState(value);

  function onChange(editorState) {
    const editorStateJSON = editorState.toJSON();
    setEditorState(JSON.stringify(editorStateJSON));
    setValue(JSON.stringify(editorStateJSON));
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <ToolbarPlugin />
      { isRichText ?  
      <RichTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div className="editor-placeholder">{placeholder}</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      : 
      <PlainTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div className="editor-placeholder">{placeholder}</div>}
        ErrorBoundary={LexicalErrorBoundary}
      /> }
      <HistoryPlugin />
      <MyCustomAutoFocusPlugin />
      <OnChangePlugin onChange={onChange} />
    </LexicalComposer>
  );
};

export default Editor;
