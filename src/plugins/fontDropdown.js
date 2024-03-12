import React from 'react';
import { Button, Dropdown, Select, Space } from "antd";
import Icons from '../icons';

// --------------------------------------------------

const FONT_FAMILY_OPTIONS = [
  { value: "Arial", label: "Arial" },
  { value: "Courier New", label: "Courier New" },
  { value: "Georgia", label: "Georgia" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Trebuchet MS", label: "Trebuchet MS" },
  { value: "Verdana", label: "Verdana" },
];

export const defaultFont = ({ configuration }) => {
  var fonts = configuration.toolbar.fonts || FONT_FAMILY_OPTIONS;
  return configuration.toolbar.defaultFont
  ? fonts.find(x => x.value === configuration.toolbar.defaultFont) || fonts[0]
  : fonts[0];
}


// --------------------------------------------------
const FontDropDown = ({ fonts, value, onChange = () => {} }) => {
  const configuredFonts = (fonts && fonts.length > 0 ? fonts :  FONT_FAMILY_OPTIONS);
  const selected = () => value && configuredFonts.find(x => x.value === value) || configuredFonts[0];
  onFontSelect = (item) => {
    onChange(item.key);
  }
  const items = configuredFonts
  .map(i => ({
    key: i.value,
    label: i.label,
  }));

  return (
    <Dropdown menu={{
      items,
      selectedKeys : [ selected() ],
      onClick: onFontSelect,
    }}
      onClick={onFontSelect}>
      <Button type="text" size="large">
        <Space>
          { selected().label }
          <Icons.Down />
        </Space>
        </Button>
    </Dropdown>
  );
};

export default FontDropDown;
