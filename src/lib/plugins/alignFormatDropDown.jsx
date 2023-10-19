import {
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from "lexical";

import { Button, Dropdown } from "antd";

// Local imports
import Icons from '../icons'
// ----------------------------------------------------------------
function AlignFormatDropDown({ editor, isRtl, disabled = false }) {
  
  const items = [{
   onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left'),
   label: 'Left Align',
   icon: <Icons.AlignLeft />
  }, {
    onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center'),
    label: 'Center Align',
    icon: <Icons.AlignMiddle />
  }, {
    onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right'),
    label: 'Right Align',
    icon: <Icons.AlignRight />
  }, {
    onClick: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify'),
    label: 'Justify Align',
    icon: <Icons.AlignJustify />
  },{
    type: 'divider'
  }, {
    onClick: () => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined),
    label: 'Indent',
    icon: isRtl ? <Icons.IndentDecrease /> : <Icons.IndentIncrease />
  }, {
    onClick: () => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined),
    label: 'Outdent',
    icon: isRtl ? <Icons.IndentIncrease /> : <Icons.IndentDecrease />
  }]

  return (<>
    <Dropdown disabled={disabled} menu={{
      items,
    }}>
      <Button size="large" icon={<Icons.AlignLeft />} >Align</Button>
    </Dropdown>
      
    </>
  );
}

export default AlignFormatDropDown;