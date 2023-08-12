import { Select } from "antd";

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
const FontDropDown = ({ value, onChange = (e) => {} }) => {

  return (
    <Select defaultValue={ value } options={ FONT_FAMILY_OPTIONS } onChange={ onChange } />
  );
};

export default FontDropDown;
