import React, { Fragment } from 'react';

import {INSERT_HORIZONTAL_RULE_COMMAND} from '@lexical/react/LexicalHorizontalRuleNode';

// 3rd party
import { Button, Dropdown, Space, Tooltip } from "antd";
// local import
import Icons from "../icons";

// --------------------------------------

function InsertDropDown({
    editor,
    disabled = false,
    locale
  }) {
    const onHorizontalRule = () => {
        editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
    };
    const onInsertImage = () => {

    }
    const items = [{
        onClick: onHorizontalRule,
        label: locale.resources.horizontalRule,
        icon: <Icons.HorizontalRule />
      }, {
        onClick: onInsertImage,
        label: locale.resources.image,
        icon: <Icons.Image/>,
      }, ]

    return (
      <Dropdown disabled={disabled} menu={{items}}>
        <Button type="text" size="large" icon={<Icons.Plus />}>
          <Space>
            {locale.resources.insert}
            <Icons.Down />
          </Space>
        </Button>
      </Dropdown>
    );
  }

export default InsertDropDown;
