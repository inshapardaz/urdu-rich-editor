import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  DEPRECATED_$isGridSelection,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  KEY_MODIFIER_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  $createCodeNode,
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  CODE_LANGUAGE_MAP,
  getLanguageFriendlyName,
} from '@lexical/code';
import {
  $isListNode,
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
  $setBlocksType,
} from "@lexical/selection";
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils';
import {$isTableNode} from '@lexical/table';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
  HeadingTagType,
} from '@lexical/rich-text';
import { useCallback, useEffect, useState } from "react";

// -----------------------------------------------------------
import { Button, Dropdown, Menu } from "antd";
// -----------------------------------------------------------
import { getSelectedNode } from '../utils/getSelectedNode';
import FontDropDown from "./fontDropdown";
import FontSizeDropDown from "./fontSizeDropdown";
import Icons from '../icons'
// -----------------------------------------------------------
const blockTypeToBlockName = {
  bullet: 'Bulleted List',
  check: 'Check List',
  code: 'Code Block',
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  number: 'Numbered List',
  paragraph: 'Normal',
  quote: 'Quote',
};
// -----------------------------------------------------------

function dropDownActiveClass(active) {
  if (active) return 'active dropdown-item-active';
  else return '';
}

function BlockFormatDropDown({
  editor,
  blockType,
  rootType,
  disabled = false,
}) {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (
        $isRangeSelection(selection) ||
        DEPRECATED_$isGridSelection(selection)
      ) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();

        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection))
              selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  return (
    <Menu
      disabled={disabled}
      buttonLabel={blockTypeToBlockName[blockType]}
      buttonAriaLabel="Formatting options for text style">
      <Menu.Item
        className={'item ' + dropDownActiveClass(blockType === 'paragraph')}
        onClick={formatParagraph}>
        <i className="icon paragraph" />
        <span className="text">Normal</span>
      </Menu.Item>
      <Menu.Item
        className={'item ' + dropDownActiveClass(blockType === 'h1')}
        onClick={() => formatHeading('h1')}>
        <i className="icon h1" />
        <span className="text">Heading 1</span>
      </Menu.Item>
      <Menu.Item
        className={'item ' + dropDownActiveClass(blockType === 'h2')}
        onClick={() => formatHeading('h2')}>
        <i className="icon h2" />
        <span className="text">Heading 2</span>
      </Menu.Item>
      <Menu.Item
        className={'item ' + dropDownActiveClass(blockType === 'h3')}
        onClick={() => formatHeading('h3')}>
        <i className="icon h3" />
        <span className="text">Heading 3</span>
      </Menu.Item>
      <Menu.Item
        className={'item ' + dropDownActiveClass(blockType === 'bullet')}
        onClick={formatBulletList}>
        <i className="icon bullet-list" />
        <span className="text">Bullet List</span>
      </Menu.Item>
      <Menu.Item
        className={'item ' + dropDownActiveClass(blockType === 'number')}
        onClick={formatNumberedList}>
        <i className="icon numbered-list" />
        <span className="text">Numbered List</span>
      </Menu.Item>
      <Menu.Item
        className={'item ' + dropDownActiveClass(blockType === 'check')}
        onClick={formatCheckList}>
        <i className="icon check-list" />
        <span className="text">Check List</span>
      </Menu.Item>
      <Menu.Item
        className={'item ' + dropDownActiveClass(blockType === 'quote')}
        onClick={formatQuote}>
        <i className="icon quote" />
        <span className="text">Quote</span>
      </Menu.Item>
      <Menu.Item
        className={'item ' + dropDownActiveClass(blockType === 'code')}
        onClick={formatCode}>
        <i className="icon code" />
        <span className="text">Code Block</span>
      </Menu.Item>
    </Menu>
  );
}
// -----------------------------------------------------------

const ToolbarPlugin = () => {
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
  const [fontSize, setFontSize] = useState("15px");
  const [fontColor, setFontColor] = useState("#000");
  const [bgColor, setBgColor] = useState("#fff");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [codeLanguage, setCodeLanguage] = useState('');
  const [isLink, setIsLink] = useState(false);

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
          if (type in blockTypeToBlockName) {
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
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px'),
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
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial'),
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

  const changeFont = (fontName) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          "font-family": fontName,
        });
      }
    });
  };

  const changeFontSize = (fontSize) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          "font-size": fontSize,
        });
      }
    });
  };

  const items = [
    { key: "bullet", label: "Bulleted List" },
    { key: "check", label: "Check List" },
    { key: "code", label: "Code Block" },
    { key: "h1", label: "Heading 1" },
    { key: "h2", label: "Heading 2" },
    { key: "h3", label: "Heading 3" },
    { key: "h4", label: "Heading 4" },
    { key: "h5", label: "Heading 5" },
    { key: "h6", label: "Heading 6" },
    { key: "number", label: "Numbered List" },
    { key: "paragraph", label: "Normal" },
    { key: "quote", label: "Quote" },
  ];
  // --------------------------------------------------
  
    const formatParagraph = () => {
      editor.update(() => {
        const selection = $getSelection();
        if (
          $isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)
        ) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    };
  
    const formatHeading = (headingSize) => {
      if (blockType !== headingSize) {
        editor.update(() => {
          const selection = $getSelection();
          if (
            $isRangeSelection(selection) ||
            DEPRECATED_$isGridSelection(selection)
          ) {
            $setBlocksType(selection, () => $createHeadingNode(headingSize));
          }
        });
      }
    };
  
    const formatBulletList = () => {
      if (blockType !== "bullet") {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      }
    };
  
    const formatCheckList = () => {
      if (blockType !== "check") {
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      }
    };
  
    const formatNumberedList = () => {
      if (blockType !== "number") {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      }
    };
  
    const formatQuote = () => {
      if (blockType !== "quote") {
        editor.update(() => {
          const selection = $getSelection();
          if (
            $isRangeSelection(selection) ||
            DEPRECATED_$isGridSelection(selection)
          ) {
            $setBlocksType(selection, () => $createQuoteNode());
          }
        });
      }
    };
  
    const formatCode = () => {
      if (blockType !== "code") {
        editor.update(() => {
          let selection = $getSelection();
  
          if (
            $isRangeSelection(selection) ||
            DEPRECATED_$isGridSelection(selection)
          ) {
            if (selection.isCollapsed()) {
              $setBlocksType(selection, () => $createCodeNode());
            } else {
              const textContent = selection.getTextContent();
              const codeNode = $createCodeNode();
              selection.insertNodes([codeNode]);
              selection = $getSelection();
              if ($isRangeSelection(selection))
                selection.insertRawText(textContent);
            }
          }
        });
      }
    };
  
    const onChange = (e) => {
      switch (e.key) {
        case "bullet":
          formatBulletList();
          break;
        case "number":
          formatNumberedList();
          break;
        case "check":
          formatCheckList();
          break;
        case "code":
          formatCode();
          break;
        case "h1":
          formatHeading('h1');
          break;
        case "h2":
          formatHeading('h2')
          break;
        case "h3":
          formatHeading('h3')
          break;
        case "h4":
          formatHeading('h4')
          break;
        case "h5":
          formatHeading('h5')
          break;
        case "h6":
          formatHeading('h6')
          break;
        case "paragraph":
          formatParagraph();
          break;
        case "quote":
          formatQuote();
          break;
        default:
            break;
      }
    } 

  return (
    <>
      <Button.Group>
        <Button onClick={() => activeEditor.dispatchCommand(UNDO_COMMAND, undefined)}
          disabled={!canUndo}>
              <Icons.Undo />
          </Button>
        <Button
          onClick={() => activeEditor.dispatchCommand(REDO_COMMAND, undefined)}
          disabled={!canRedo}
        >
          <Icons.Redo />
        </Button>
        <Button
          checked={isBold}
          onClick={() =>
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
          }
        >
          <Icons.Bold />
        </Button>
        <Button
          onClick={() =>
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
          }
        >
          <Icons.Italic />
        </Button>
        <Button
          onClick={() =>
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")
          }
        >
          <Icons.Underline />
        </Button>
        <Button
          onClick={() =>
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough")
          }
        >
          <Icons.Strikethrough />
        </Button>
        <Button
          onClick={() =>
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "subscript")
          }
        >
          <Icons.SubScript />
        </Button>
        <Button
          onClick={() =>
            activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "superscript")
          }
        >
          <Icons.SuperScript />
        </Button>
      </Button.Group>
      <FontDropDown value={fontFamily} onChange={changeFont} />
      <FontSizeDropDown value={fontSize} onChange={changeFontSize} />
      <Dropdown menu={{ items, onClick : onChange }}>
        <Button>Style</Button>
      </Dropdown>
    </>
  );
};

export default ToolbarPlugin;
