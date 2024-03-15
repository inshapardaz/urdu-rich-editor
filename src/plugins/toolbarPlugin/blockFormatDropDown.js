import React, { Fragment } from 'react'

import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  DEPRECATED_$isGridSelection,
} from "lexical";
import { $createCodeNode } from '@lexical/code';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND
} from '@lexical/list';
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode,  $createQuoteNode } from '@lexical/rich-text';

import { Button, Dropdown, Space } from "antd";

// Local imports
import Icons from '../../icons'

// ----------------------------------------------------------------

export const blockTypeToBlockName = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  paragraph: 'Normal',
  bullet: 'bullet',
  number: 'number',
  quote: 'quote',
  code: 'code'

};
// ----------------------------------------------------------------
function BlockFormatDropDown({
  editor, blockType, disabled = false, locale
}) {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection) ||
        DEPRECATED_$isGridSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)) {
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
        if ($isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();

        if ($isRangeSelection(selection) ||
          DEPRECATED_$isGridSelection(selection)) {
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

  const items = [{
    onClick: formatParagraph,
    label: locale.resources.normal,
    icon: <Icons.Paragraph />,
    id: blockTypeToBlockName.normal
  }, {
    onClick: () => formatHeading('h1'),
    label: locale.resources.heading1,
    icon: <Icons.TextHeading1 />,
    id: blockTypeToBlockName.h1
  }, {
    onClick: () => formatHeading('h2'),
    label: locale.resources.heading2,
    icon: <Icons.TextHeading2 />,
    id: blockTypeToBlockName.h2
  }, {
    onClick: () => formatHeading('h3'),
    label: locale.resources.heading3,
    icon: <Icons.TextHeading3 />,
    id: blockTypeToBlockName.h3
  }, {
    onClick: () => formatHeading('h4'),
    label: locale.resources.heading4,
    icon: <Icons.TextHeading4 />,
    id: blockTypeToBlockName.h4
  }, {
    onClick: () => formatHeading('h5'),
    label: locale.resources.heading5,
    icon: <Icons.TextHeading5 />,
    id: blockTypeToBlockName.h5
  }, {
    onClick: () => formatHeading('h6'),
    label: locale.resources.heading6,
    icon: <Icons.TextHeading6 />,
    id: blockTypeToBlockName.h6
  }, {
    type: 'divider'
  }, {

    onClick: formatBulletList,
    label: locale.resources.bulletList,
    icon: <Icons.BulletList/>,
    id: blockTypeToBlockName.bullet
  }, {
    onClick: formatNumberedList,
    label: locale.resources.numberList,
    icon: <Icons.NumberList/>,
    id: blockTypeToBlockName.number
  }, {
    onClick: formatQuote,
    label: locale.resources.quote,
    icon: <Icons.Quote/>,
    id: blockTypeToBlockName.quote
  }, {
    onClick: formatCode,
    label: locale.resources.code,
    icon: <Icons.Code/>,
    id: blockTypeToBlockName.code
  }]

  const selectedItem = items.find(item => item.id === blockType);

  return (<>
    <Dropdown disabled={disabled} menu={{
      items,
    }}>
      <Button type="text" size="large" icon={selectedItem?.icon ?? <Icons.Paragraph />}>
          <Icons.Down />
      </Button>
    </Dropdown>
    </>
  );
}

export default BlockFormatDropDown;
