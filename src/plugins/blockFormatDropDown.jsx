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

import { Button, Dropdown } from "antd";

// Local imports
import Icons from '../images/icons'
// ----------------------------------------------------------------

export const blockTypeToBlockName = {
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
  h4: 'Heading 4',
  h5: 'Heading 5',
  h6: 'Heading 6',
  paragraph: 'Normal',
  bullet: 'Bullet List',
  number: 'Number List',
  quote: 'Quote',
  code: 'Code'

};

const blockTypeToBlockIcon = {
  h1: <Icons.TextHeading1 />,
  h2: <Icons.TextHeading2 />,
  h3: <Icons.TextHeading3 />,
  h4: <Icons.TextHeading4 />,
  h5: <Icons.TextHeading5 />,
  h6: <Icons.TextHeading6 />,
  paragraph: <Icons.Paragraph />,
  bullet: <Icons.BulletList />,
  number: <Icons.NumberList />,
  quote: <Icons.Quote />,
  code: <Icons.Code />
};
// ----------------------------------------------------------------
function BlockFormatDropDown({
  editor, blockType, disabled = false,
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
    label: 'Normal',
    icon: <Icons.Paragraph />
  }, {
    onClick: () => formatHeading('h1'),
    label: 'Heading 1',
    icon: <Icons.TextHeading1 />
  }, {
    onClick: () => formatHeading('h2'),
    label: 'Heading 2',
    icon: <Icons.TextHeading2 />
  }, {
    onClick: () => formatHeading('h3'),
    label: 'Heading 3',
    icon: <Icons.TextHeading3 />
  }, {
    onClick: () => formatHeading('h4'),
    label: 'Heading 4',
    icon: <Icons.TextHeading4 />
  }, {
    onClick: () => formatHeading('h5'),
    label: 'Heading 5',
    icon: <Icons.TextHeading5 />
  }, {
    onClick: () => formatHeading('h6'),
    label: 'Heading 6',
    icon: <Icons.TextHeading6 />
  }, {
    type: 'divider'
  }, {

    onClick: formatBulletList,
    label: 'Bullet List',
    icon: <Icons.BulletList/>,
  }, {
    onClick: formatNumberedList,
    label: 'Number List',
    icon: <Icons.NumberList/>,
  }, {
    onClick: formatQuote,
    label: 'Quote',
    icon: <Icons.Quote/>,
  }, {
    onClick: formatCode,
    label: 'Code',
    icon: <Icons.Code/>,
  }]

  return (<>
    <Dropdown disabled={disabled} menu={{
      items,
    }}>
      <Button size="large" icon={blockTypeToBlockIcon[blockType]}>{blockTypeToBlockName[blockType]}</Button>
    </Dropdown>
      
    </>
  );
}

export default BlockFormatDropDown;