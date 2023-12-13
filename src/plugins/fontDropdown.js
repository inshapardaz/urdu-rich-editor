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

// --------------------------------------------------
const FontDropDown = ({ fonts, value, onChange = () => {} }) => {
  const items = (fonts && fonts.length > 0 ? fonts :  FONT_FAMILY_OPTIONS)
  .map(i => ({
    onClick: () => onChange(i.value),
    label: i.label,
  }));
  return (
    <Dropdown menu={{items}}>
      <Button type="text" size="large">
        <Space>
          {value}
          <Icons.Down />
        </Space>
        </Button>
    </Dropdown>
  );
};

export default FontDropDown;
