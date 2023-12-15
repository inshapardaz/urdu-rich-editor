import React from 'react';
import { Button, Tooltip, theme } from 'antd';

const CheckButton = ({ checked, tooltip, children, ...other}) => {
    const { token: { colorBgTextHover } } = theme.useToken();

    const checkedStyles = { backgroundColor: colorBgTextHover }
    if (tooltip) {
      return (<Tooltip title={tooltip}>
        <Button {...other} style={checked ? checkedStyles : null}>
          {children}
        </Button>
      </Tooltip>);
    }
    return (<Button {...other} style={checked ? checkedStyles : null}>
        {children}
    </Button>)
}

export default CheckButton;
