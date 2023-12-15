import React, {useEffect, useState } from 'react'

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
import i18n  from './i18n';
import './styles.module.css'; // Import css modules stylesheet as styles

// ------------------------------------------------------

const EMPTY_CONTENT =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

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
  return <div className="editorPlaceholder" data-ft="placeholder">{children}</div>;
}
// ------------------------------------------------------

export default ({ value = EMPTY_CONTENT,
  setValue = () => {},
  configuration = {
    richText : false,
    toolbar : {
      fonts : null,
      fontSizes: null,
    },
    language : "en",
    languageTools: false,
    placeholder : null,
  }
}) => {
  const locale = i18n[configuration.language];
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
        { configuration.richText && <ToolbarPlugin configuration={configuration.toolbar} locale={locale} /> }
        { configuration.richText ? <>
          <RichTextPlugin
            contentEditable={<ContentEditable className="editorInput" />}
            placeholder={<Placeholder>{configuration.placeholder ??  locale.resources.placeholder }</Placeholder>}
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
          contentEditable={<ContentEditable className="editorInput" />}
          placeholder={<Placeholder>{configuration.placeholder ??  locale.resources.placeholder}</Placeholder>}
          ErrorBoundary={LexicalErrorBoundary}
        /> }
        <HistoryPlugin />
        <MyCustomAutoFocusPlugin />
        <OnChangePlugin onChange={onChange} />
      </LexicalComposer>
  );
};
