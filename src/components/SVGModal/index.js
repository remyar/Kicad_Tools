import React, { useState, useEffect, Suspense, useMemo , useRef } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

function BootstrapDialogTitle(props) {
    const { children, onClose, ...other } = props;

    return (
        <DialogTitle sx={{ m: 0, p: 2, maxWidth: "inherit" }} {...other}>
            {children}
            {onClose ? (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </DialogTitle>
    );
}

BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
};

function ModalSVG(props) { 

    return <Dialog
        onClose={() => { props.onClose && props.onClose(); }}
        aria-labelledby="customized-dialog-title"
        open={true}
        sx={{ maxWidth: "inherit" }}
    >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { props.onClose && props.onClose(); }}>
            
        </BootstrapDialogTitle>
        <DialogContent dividers >
            <Box sx={{ width: "550px", height: "60vh" }}>
            </Box>
        </DialogContent>
    </Dialog>
}

export default ModalSVG;