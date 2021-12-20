import React, { useState, useEffect } from 'react';

import Backdrop from '@mui/material/Backdrop';


function Modal(props) {
    return <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={props.display}
        onClick={() => { props.onClose && props.onClose();}}

    >
        {props.children}
    </Backdrop>
}

export default Modal;