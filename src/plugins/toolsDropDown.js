import React, { Fragment } from 'react';

import { AUTO_CORRECT_COMMAND, SPELLCHECK_COMMAND, PUNCTUATION_CORRECT_COMMAND } from '../commands/spellCheckCommand';

// 3rd party
import { Button, Dropdown, Space, Tooltip } from "antd";
// local import
import Icons from "../icons";

// --------------------------------------

function ToolsDropDown({
    editor,
    disabled = false,
    locale
  }) {
    const items = [{
        onClick: () => editor.dispatchCommand(PUNCTUATION_CORRECT_COMMAND),
        label: locale.resources.punctuation,
        icon: <Icons.Punctuation />
      }, {
        onClick: () => editor.dispatchCommand(AUTO_CORRECT_COMMAND),
        label: locale.resources.autoCorrect,
        icon: <Icons.AutoCorrect />,
      }, {
        onClick: () => editor.dispatchCommand(SPELLCHECK_COMMAND),
        label: locale.resources.spellchecker,
        icon: <Icons.SpellChecker />,
      } ]

    return (
      <Dropdown disabled={disabled} menu={{items}}>
        <Button type="text" size="large" icon={<Icons.Tools />}>
          <Space>
            {locale.resources.tools}
            <Icons.Down />
          </Space>
        </Button>
      </Dropdown>
    );
  }

export default ToolsDropDown;
