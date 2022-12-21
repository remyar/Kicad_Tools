import React, { useState, useEffect, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { AccumulativeShadows, RandomizedLight, OrbitControls, Environment, Lightformer } from '@react-three/drei'
import Button from '@mui/material/Button';

import Backdrop from '@mui/material/Backdrop';
import TableContainer from '@mui/material/TableContainer';
import Box from '@mui/material/Box';

import utils from '../../utils';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader';

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

function Modal3D(props) {

    const ref = React.useRef(null);

    let component = props.component;
    let loader = new VRMLLoader();
    let scene = loader.parse(component.wrl);

    return <Dialog
        onClose={() => { props.onClose && props.onClose(); }}
        aria-labelledby="customized-dialog-title"
        open={true}
        sx={{ maxWidth: "inherit" }}
    >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { props.onClose && props.onClose(); }}>
            {component?.package}
        </BootstrapDialogTitle>
        <DialogContent dividers >
            <Box sx={{ width: "550px", height: "60vh" }}>
                <Canvas ref={ref} orthographic={true} camera={{ zoom: 50, position: [0, 0, 100] }}>
                    <primitive object={scene} />
                    <OrbitControls />
                </Canvas>
            </Box>
        </DialogContent>
    </Dialog>
}

export default Modal3D;