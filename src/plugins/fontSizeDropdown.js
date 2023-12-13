import React from 'react';
import { Button, Dropdown, Select, Space } from "antd";
import Icons from '../icons';

// --------------------------------------------------

const FONT_SIZE_OPTIONS = [
  { value: "10px", label: "10px" },
  { value: "11px", label: "11px" },
  { value: "12px", label: "12px" },
  { value: "13px", label: "13px" },
  { value: "14px", label: "14px" },
  { value: "15px", label: "15px" },
  { value: "16px", label: "16px" },
  { value: "17px", label: "17px" },
  { value: "18px", label: "18px" },
  { value: "19px", label: "19px" },
  { value: "24px", label: "24px" },
  { value: "26px", label: "26px" },
  { value: "30px", label: "30px" },
  { value: "36px", label: "36px" },
  { value: "42px", label: "42px" },
  { value: "68px", label: "68px" },
  { value: "80px", label: "80px" },
];

// --------------------------------------------------
const FontSizeDropDown = ({ value, fontSizes, onChange = () => {} }) => {
  const items = (fontSizes && fontSizes.length > 0 ? fontSizes :  FONT_SIZE_OPTIONS)
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

export default FontSizeDropDown;
