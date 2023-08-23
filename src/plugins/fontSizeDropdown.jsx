import { Select } from "antd";

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
const FontSizeDropDown = ({ value, onChange = (e) => {} }) => {

  return (
    <Select size="large" defaultValue={ value } options={ FONT_SIZE_OPTIONS } onChange={ onChange } />
  );
};

export default FontSizeDropDown;
