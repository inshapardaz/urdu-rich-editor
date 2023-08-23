import { Button, theme } from 'antd';

const CheckButton = ({ checked, children, ...other}) => {
    const { token: { colorBgTextHover } } = theme.useToken();

    const checkedStyles = { backgroundColor: colorBgTextHover }
    return (<Button {...other} style={checked ? checkedStyles : null}>
        {children}
    </Button>)
}

export default CheckButton;