import {INSERT_HORIZONTAL_RULE_COMMAND} from '@lexical/react/LexicalHorizontalRuleNode';

// 3rd party
import { Button, Dropdown } from "antd";
// local import
import Icons from "../icons";

// --------------------------------------
 
function InsertDropDown({
    editor, disabled = false,
  }) {
    const onHorizontalRule = () => {
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
    };
    const onInsertImage = () => {

    }
    const items = [{
        onClick: onHorizontalRule,
        label: 'Horizontal Rule',
        icon: <Icons.HorizontalRule />
      }, {
        onClick: onInsertImage,
        label: 'Insert Image',
        icon: <Icons.Image/>,
      }, ]
    
      return (<>
        <Dropdown disabled={disabled} menu={{
          items,
        }}>
          <Button size="large" icon={<Icons.Plus />}>Insert</Button>
        </Dropdown>
          
        </>
      );
  }
  
export default InsertDropDown;