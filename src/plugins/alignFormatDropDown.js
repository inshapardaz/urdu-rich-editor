import React, { Fragment } from 'react';

import {
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from "lexical";

import { Button, Dropdown, Space } from "antd";

// Local imports
import Icons from '../icons'
// ----------------------------------------------------------------
function AlignFormatDropDown({ editor, disabled = false, locale }) {
  const items = [{
   onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left'),
   label: locale.resources.alignLeft,
   icon: <Icons.AlignLeft />
  }, {
    onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center'),
    label: locale.resources.alignCenter,
    icon: <Icons.AlignMiddle />
  }, {
    onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right'),
    label: locale.resources.alignRight,
    icon: <Icons.AlignRight />
  }, {
    onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify'),
    label: locale.resources.alignJustify,
    icon: <Icons.AlignJustify />
  },{
    type: 'divider'
  }, {
    onClick: () => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined),
    label: locale.resources.indent,
    icon: locale.isRtl ? <Icons.IndentDecrease /> : <Icons.IndentIncrease />
  }, {
    onClick: () => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined),
    label: locale.resources.outdent,
    icon: locale.isRtl ? <Icons.IndentIncrease /> : <Icons.IndentDecrease />
  }]

  return (
    <Dropdown disabled={disabled} menu={{items}}>
      <Button type="text" size="large" icon={<Icons.AlignLeft />}>
        <Space>
        {locale.resources.align}
          <Icons.Down />
        </Space>
        </Button>
    </Dropdown>
  );
}

export default AlignFormatDropDown;
