import { useEffect, useState } from "react";
// ------------------------------------------------------

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";

// ------------------------------------------------------
import ToolbarPlugin from "./plugins/toolbar";
import AutoLinkPlugin from './plugins/autoLink.Plugin';
import { HorizontalRulePlugin } from './plugins/horizontalRulePlugin';
import LinkPlugin from './plugins/link.Plugin';
import EditorNodes from "./nodes";
import EditorTheme from './themes/editorTheme'
// ------------------------------------------------------
import './editor.css'
// ------------------------------------------------------

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
function Placeholder({ children }) {
  return <div className="editor-placeholder">{children}</div>;
}
// ------------------------------------------------------

const Editor = ({ placeholder = "Enter some text...", richText = false, value = null, setValue = () => {} }) => {
  const [editorState, setEditorState] = useState(value);
  const initialConfig = {
    namespace: "MyEditor",
    editorState: editorState,
    nodes: [...EditorNodes],
    theme: EditorTheme,
    onError,
  };


  function onChange(state) {
    const editorStateJSON = state.toJSON();
    setEditorState(JSON.stringify(editorStateJSON));
    setValue(JSON.stringify(editorStateJSON));
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      { richText && <ToolbarPlugin /> }
      { richText ? <>
        <RichTextPlugin
          contentEditable={<ContentEditable className="editor-input" />}
          placeholder={<Placeholder>{placeholder}</Placeholder>}
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <CheckListPlugin />
        <AutoLinkPlugin />
        <LinkPlugin />
        <HorizontalRulePlugin />
      </>
      : 
      <PlainTextPlugin
        contentEditable={<ContentEditable className="editor-input" />}
        placeholder={<Placeholder>{placeholder}</Placeholder>}
        ErrorBoundary={LexicalErrorBoundary}
      /> }
      <HistoryPlugin />
      <MyCustomAutoFocusPlugin />
      <OnChangePlugin onChange={onChange} />
    </LexicalComposer>
  );
};

export default Editor;
