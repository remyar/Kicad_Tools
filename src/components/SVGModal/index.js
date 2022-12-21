import React, { useState, useEffect, Suspense, useMemo , useRef } from 'react';
import PropTypes from 'prop-types';
import flatten from 'lodash-es/flatten';

import Box from '@mui/material/Box';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { Canvas, useFrame, useLoader , extend , useThree} from '@react-three/fiber';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

extend({ OrbitControls });

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

function SvgShape({shape, color, index}) {
    const mesh = useRef();
    return (
        <mesh
            ref={mesh}
        >
            <shapeBufferGeometry attach="geometry" args={[shape]} />
            <meshBasicMaterial
                aspect={window.innerWidth / window.innerHeight}
                attach="material"
                color={color === 'none' ? "#000000" : color}
                opacity={1}
                side={THREE.DoubleSide}
                flatShading={true}
                depthWrite={true}
                /*
          HACK: Offset SVG polygons by index
          The paths from SVGLoader Z-fight.
          This fix causes stacking problems with detailed SVGs.
        */
                polygonOffset
                polygonOffsetFactor={index * -0.1}
            />
        </mesh>
    );
}

function Scene(props) {
    let shapes= props.sceneSVG;
    return (
        <group 
            color={new THREE.Color("#b0b0b0")} 
            >
            {shapes.map(item =>  
                <SvgShape key={item.shape.uuid} {...item} />
            )}
        </group>
    );
}

const Camera = () => {
    const {
        camera,
        gl: { domElement },
    } = useThree();

    const controls = useRef();

    camera.position.z = 200;

    useFrame(() => controls.current.update());

    return (
        <orbitControls
            ref={controls}
            args={[camera, domElement]}
            enableZoom={true}
        />
    );
};

function ModalSVG(props) {
    const ref = React.useRef(null);

    let component = props.component;
    let loader = new SVGLoader();
    let { paths } = loader.parse(component);

    let sceneSVG = flatten(paths.map((group, index) => {
        return group.toShapes(true).map(shape => {
            const fillColor = group.userData.style.fill
                return ({ shape, color: fillColor, index })
            })
        }));

    return <Dialog
        onClose={() => { props.onClose && props.onClose(); }}
        aria-labelledby="customized-dialog-title"
        open={true}
        sx={{ maxWidth: "inherit" }}
    >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={() => { props.onClose && props.onClose(); }}>
            ddd
        </BootstrapDialogTitle>
        <DialogContent dividers >
            <Box sx={{ width: "550px", height: "60vh" }}>
                <Canvas ref={ref} orthographic={true} camera={{ zoom: 50, position: [0, 0, 100] }}>
                    <Camera/>
                    <ambientLight intensity={0.5} />
                    <spotLight intensity={0.5} position={[0, 0, 200]} />
                    <Scene sceneSVG={sceneSVG}/>
                </Canvas>
            </Box>
        </DialogContent>
    </Dialog>
}

export default ModalSVG;