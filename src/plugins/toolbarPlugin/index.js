import React from 'react';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import useLexicalEditable from '@lexical/react/useLexicalEditable';
import {
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
  KEY_MODIFIER_COMMAND,
  $getRoot,
} from "lexical";
import {
  $isCodeNode,
  CODE_LANGUAGE_MAP,
} from '@lexical/code';
import {
  $isListNode,
  ListNode,
} from '@lexical/list';
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
} from "@lexical/selection";
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils';
import {$isTableNode} from '@lexical/table';
import { $isHeadingNode } from '@lexical/rich-text';
import { useCallback, useEffect, useState } from "react";

// -----------------------------------------------------------
import { Button, Divider, InputNumber, Tooltip } from "antd";
// -----------------------------------------------------------

import { sanitizeUrl } from '../../utils/url';
import { getSelectedNode } from '../../utils/getSelectedNode';
import FontDropDown, { defaultFont } from "./fontDropdown";
import BlockFormatDropDown, { blockTypeToBlockName } from './blockFormatDropDown';
import InsertDropDown from "./insertDropDown";
import ToolsDropdown from "./toolsDropDown";
import Icons from '../../icons'
import CheckButton from "../../components/checkButton";
import AlignFormatDropDown from "./alignFormatDropDown";
import styles from "../../styles.module.css";
import { SAVE_COMMAND } from '../../commands/saveCommand';
// -----------------------------------------------------------

const ToolbarPlugin = ({ configuration, setIsLinkEditMode, locale }) => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isRTL, setIsRTL] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [rootType, setRootType] = useState('root');
  const [blockType, setBlockType] = useState('paragraph');
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [fontSize, setFontSize] = useState(15);
  const [fontColor, setFontColor] = useState("#000");
  const [bgColor, setBgColor] = useState("#fff");
  const [fontFamily, setFontFamily] = useState(configuration.toolbar.defaultFont);
  const [codeLanguage, setCodeLanguage] = useState('');
  const [isLink, setIsLink] = useState(false);
  const isEditable = useLexicalEditable();

  // TODO: Set Default Font
  useEffect(() => {
    editor.update(() => {
      if (!editor || !configuration) return;
      $getRoot()?.getChildAtIndex(0)?.select();
      const selection = $getSelection();
      if (selection) {
        $patchStyleText(selection, {
          'font-family': defaultFont(configuration?.toolbar?.fonts),
        });
      }
    });
  }, [editor, configuration]);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType('table');
      } else {
        setRootType('root');
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(
            anchorNode,
            ListNode,
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName  ) {
            setBlockType(type);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage();
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : '',
            );
            return;
          }
        }
      }

      // Handle buttons
      setFontSize(
        parseInt($getSelectionStyleValueForProperty(selection, 'font-size', '15px').replace('px',''))
      );
      setFontColor(
        $getSelectionStyleValueForProperty(selection, 'color', '#000'),
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#fff',
        ),
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, 'font-family', defaultFont({ configuration }).value)
      );
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updateToolbar, activeEditor, editor]);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event = payload;
        const {code, ctrlKey, metaKey} = event;

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault();
          return activeEditor.dispatchCommand(
            TOGGLE_LINK_COMMAND,
            sanitizeUrl('https://'),
          );
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL,
    );
  }, [activeEditor, isLink]);

  const changeFont = (font) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          "font-family": font,
        });
              }
    });
  };

  const changeFontSize = (fontSize) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          "font-size": `${fontSize}px`,
        });
      }
    });
  };

  const insertLink = useCallback(() => {
    if (!isLink) {
      setIsLinkEditMode(true);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl('https://'));
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  return (
    <div className={styles.toolbar}>
      { configuration.toolbar.showSave && <Tooltip title={locale.resources.save}>
        <Button type="text" onClick={() => editor.dispatchCommand(SAVE_COMMAND) }
          icon={ <Icons.Save /> } />
      </Tooltip>}
      { configuration.toolbar.showUndoRedo && <>
      <Tooltip title={locale.resources.undo}>
        <Button type="text" onClick={() => activeEditor.dispatchCommand(UNDO_COMMAND, undefined)} disabled={!canUndo}
          icon={ locale.isRtl ? <Icons.Redo /> : <Icons.Undo />} />
      </Tooltip>
      <Tooltip title={locale.resources.redo}>
        <Button type="text" onClick={() => activeEditor.dispatchCommand(REDO_COMMAND, undefined)} disabled={!canRedo}
          icon={locale.isRtl ? <Icons.Undo /> : <Icons.Redo /> } />
      </Tooltip>
      <Divider type="vertical" /></> }
      { configuration.toolbar.showBlockFormat && <>
      <BlockFormatDropDown
            disabled={!isEditable}
            blockType={blockType}
            rootType={rootType}
            editor={editor}
            locale={locale}
        />
      <Divider type="vertical" />
      </> }
      <CheckButton type="text" tooltip={locale.resources.bold} checked={isBold} onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")} icon={<Icons.Bold />} />
      <CheckButton type="text" tooltip={locale.resources.italic} checked={isItalic} onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")} icon={<Icons.Italic />} />
      <CheckButton type="text" tooltip={locale.resources.underline} checked={isUnderline} onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")} icon={<Icons.Underline />} />
      { configuration.toolbar.showExtraFormat && <>
      <CheckButton type="text" tooltip={locale.resources.strikethrough} checked={isStrikethrough} onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")} icon={<Icons.Strikethrough />} />
      <CheckButton type="text" tooltip={locale.resources.subscript} checked={isSubscript} onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")} icon={<Icons.SubScript />} />
      <CheckButton type="text" tooltip={locale.resources.superscript} checked={isSuperscript} onClick={() => activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")} icon={<Icons.SuperScript />} />
      </> }
      { configuration.toolbar.showInsertLink && <CheckButton type="text" tooltip={locale.resources.link} checked={isLink} onClick={insertLink} disabled={!isEditable} icon={<Icons.Link />} />}
      { configuration.toolbar.showFontFormat &&   <>
      <Divider type="vertical" />
      <FontDropDown fonts={configuration.toolbar.fonts} value={fontFamily} onChange={changeFont} />
      <InputNumber
            defaultValue={15}
            value={fontSize}
            min={9}
            max={60}
            step={1}
            onChange={changeFontSize}
        />
      </> }
      { configuration.toolbar.showAlignment && <><Divider type="vertical" /><AlignFormatDropDown editor={editor} disabled={!isEditable} locale={locale}/></> }
      { configuration.toolbar.showInsert && <><Divider type="vertical" /><InsertDropDown locale={locale} editor={editor} disabled={!isEditable} /></> }
      { configuration.spellchecker.enabled && <>
        <Divider type="vertical" />
        <ToolsDropdown locale={locale} editor={editor} disabled={!isEditable} />
        </>
      }
    </div>
  );
};

export default ToolbarPlugin;
