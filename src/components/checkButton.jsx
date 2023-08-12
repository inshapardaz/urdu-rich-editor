import { Button } from "antd"

const CheckButton = ({ checked }, props) => {
    <Button {...props}>
        {props.children}
    </Button>
}

export default CheckButton;