import React, {useEffect, useState } from 'react'

// ------------------------------------------------------

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import {
  $convertFromMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import {CAN_USE_DOM} from './utils/canUseDOM';

// ------------------------------------------------------
import ToolbarPlugin from "./plugins/toolbarPlugin";
import AutoLinkPlugin from './plugins/autoLink.Plugin';
import { HorizontalRulePlugin } from './plugins/horizontalRulePlugin';
import LinkPlugin from './plugins/link.Plugin';
import FloatingLinkEditorPlugin from './plugins/floatingLinkEditorPlugin';
import DraggableBlockPlugin from './plugins/draggableBlockPlugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import EditorNodes from "./nodes";
import EditorTheme from './themes/editorTheme'
import ContentEditable from './ui/contentEditable';
// ------------------------------------------------------
import i18n  from './i18n';
import styles from './styles.module.css';
import SavePlugin from './plugins/savePlugin';
import SpellCheckerPlugin from './plugins/spellchecker';
import { ControlledValuePlugin } from './plugins/controlledValuePlugin';

// ------------------------------------------------------
const EMPTY_CONTENT =
  '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

// ------------------------------------------------------

function onError(error) {
  console.error(error);
}

// ------------------------------------------------------
function Placeholder({ children }) {
  return <div className={styles.editorPlaceholder} data-ft="placeholder">{children}</div>;
}
// ------------------------------------------------------

export default ({ value = null,
  onChange,
  onSave,
  configuration = {
    richText : false,
    format: "raw",
    language : "en",
    placeholder : null,
    toolbar : {
      fonts : null,
      defaultFont: null,
      showAlignment: true,
      showBlockFormat: true,
      showFontFormat: true,
      showInsert: true,
      showListFormat: true,
      showUndoRedo: true,
      showExtraFormat: true,
      showInsertLink: true,
      showSave: false,
    },
    spellchecker : {
      enabled: false,
      language: "en",
      punctuationCorrections: null,
      autoCorrections: null,
      wordList: null,
    }
  }
}) => {
  const locale = i18n[configuration.language];
  const isRtl = configuration.language == "ur" ? true : false;
  const [isSmallWidthViewport, setIsSmallWidthViewport] = useState(false);
  const editorState = value === EMPTY_CONTENT ? configuration.format == 'markdown'? ' ' : EMPTY_CONTENT : value;
  const initialConfig = {
    namespace: "MyEditor",
    editorState: () => configuration.format === 'markdown' ? $convertFromMarkdownString(editorState, TRANSFORMERS) : editorState,
    nodes: [...EditorNodes],
    theme: EditorTheme,
    onError,
  };
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const [floatingAnchorElem, setFloatingAnchorElem] = useState(null);
  const onRef = (_floatingAnchorElem) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  useEffect(() => {
    const updateViewPortWidth = () => {
      const isNextSmallWidthViewport =
        CAN_USE_DOM && window.matchMedia('(max-width: 1025px)').matches;

      if (isNextSmallWidthViewport !== isSmallWidthViewport) {
        setIsSmallWidthViewport(isNextSmallWidthViewport);
      }
    };
    updateViewPortWidth();
    window.addEventListener('resize', updateViewPortWidth);

    return () => {
      window.removeEventListener('resize', updateViewPortWidth);
    };
  }, [isSmallWidthViewport]);

  return (
    <div className={ isRtl ? styles.rtl : null }>
      <LexicalComposer initialConfig={initialConfig}>
        { configuration.richText && <ToolbarPlugin configuration={configuration} setIsLinkEditMode={setIsLinkEditMode} locale={locale} /> }
        { configuration.richText ? <>
          <RichTextPlugin
            contentEditable={
              <div className={styles.editorScroller}>
                <div className={styles.editor} ref={onRef}>
                  <ContentEditable />
                </div>
              </div>
            }
            placeholder={<Placeholder>{configuration.placeholder ??  locale.resources.placeholder }</Placeholder>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ListPlugin />
          <CheckListPlugin />
          <AutoLinkPlugin />
          <LinkPlugin />
          <HorizontalRulePlugin />
          {floatingAnchorElem && !isSmallWidthViewport && (
              <>
                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                <FloatingLinkEditorPlugin
                  anchorElem={floatingAnchorElem}
                  isLinkEditMode={isLinkEditMode}
                  setIsLinkEditMode={setIsLinkEditMode}
                />
                <FloatingTextFormatToolbarPlugin
                  configuration={configuration}
                  anchorElem={floatingAnchorElem}
                />
              </>
            )}
        </>
        :
        <PlainTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<Placeholder>{configuration.placeholder ??  locale.resources.placeholder}</Placeholder>}
          ErrorBoundary={LexicalErrorBoundary}
        /> }
        <HistoryPlugin />
        <SavePlugin onSave={onSave} format={configuration.format}/>
        <SpellCheckerPlugin locale={locale} language={configuration.spellchecker.language || configuration.language } configuration={configuration.spellchecker} />
        <ControlledValuePlugin
          value={value}
          onChange={onChange}
          format={configuration.format }
          isRichtext={configuration.richText} />
        {configuration.format == "markdown" && <MarkdownShortcutPlugin transformers={TRANSFORMERS} />}
      </LexicalComposer>
    </div>
  );
};
