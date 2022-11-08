import React, { useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { AccumulativeShadows, RandomizedLight, OrbitControls, Environment, Lightformer } from '@react-three/drei'
import Button from '@mui/material/Button';

import Backdrop from '@mui/material/Backdrop';
import TableContainer from '@mui/material/TableContainer';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';

import utils from '../../utils';

import { VRMLLoader } from 'three/examples/jsm/loaders/VRMLLoader';

function Modal3D(props) {

    const ref = React.useRef(null);
    const [zoom, setZoom] = useState(false)
    const [focus, setFocus] = useState({})

    let component = props.component;
    let loader = new VRMLLoader();
    let scene = loader.parse(component.wrl)

    const [dimensions, setDimensions] = React.useState({
        height: window.innerHeight,
        width: window.innerWidth
    });

    return <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
        open={props.display}
        
    >
        <Box sx={{ width: "100vh", height: "60vh" }}>
            <Paper sx={{ padding: "15px", height: "60vh" }}>
                <Canvas ref={ref} orthographic={true} camera={{ position: [0, 0, 5], fov: 45 }}>
                    <primitive object={scene} />
                    <OrbitControls />
                </Canvas>
            </Paper>
        </Box>
    </Backdrop>
    /*
        const ref = React.useRef(null);
        const models3d = props.models3d || [];
        const component = props.component || {};
        const [SelectedModel, setSelectedModel] = useState(models3d[0]);
        const [Load , setLoad] = useState(false);
    
        const [dimensions, setDimensions] = React.useState({
            height: window.innerHeight,
            width: window.innerWidth
        });
    
        React.useEffect(() => {
            function handleResize() {
                setDimensions({
                    height: window.innerHeight,
                    width: window.innerWidth
                });
            }
    
            window.addEventListener('resize', handleResize)
    
            return _ => {
                window.removeEventListener('resize', handleResize)
    
            }
        });
    
        React.useEffect(async ()=>{
            if ( SelectedModel ){
                setLoad(true);
                let objResult = await utils.ObjectLoader.Load("https://easyeda.com/" + SelectedModel?.dataStr?.head?.url);
                if ( component.model3D ){
                    component.model3D.wrl = objResult;
                }
                setLoad(false);
            }
        },[SelectedModel]);
    
        let heightModel = (dimensions.height * 0.6).toString() + "px"
        return <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={props.display}
            onClick={() => { }}
    
        >
            <Box sx={{ width: "100vh", height: { heightModel } }}>
                <Paper sx={{ padding: "15px", height: { heightModel } }}>
                    <Select
                        onChange={(event) => {
                            let uuid = event.target.value;
                            let __m = models3d.find((_m) => _m.uuid == uuid);
                            setSelectedModel(__m);
                        }}
                        sx={{
                            width: '100%'
                        }}
                        defaultValue={SelectedModel?.uuid}
                    >
                        {models3d.map((model) => {
                            return <MenuItem key={model.uuid} value={model.uuid}>{model.title || ""}</MenuItem >
                        })}
                    </Select>
                    <br /><br />
                    <iframe ref={ref} className="dlgLibs-thumb4 for3dview" width="100%" height={heightModel} src={"https://easyeda.com/editor/6.4.32/htm/editorpage15.html?version=6.4.32&url=" + SelectedModel?.dataStr?.head?.url}>
                        <div id="canvas">
                            <canvas width="100%" height="100%" sx={{ width: "100%", height: "100%", backgroundColor: "white" }}></canvas>
                        </div>        
                    </iframe>
    
                    <Button
                        disabled={Load}
                        sx={{
                            width: '100%'
                        }}
                        variant="contained" onClick={async () => { 
                            //console.log(await ref.current.contentWindow.JSAPI.easyeda2step("" , "output"));
                            props.onClose && props.onClose(SelectedModel, component); 
                        }}> Select This Model</Button>
                </Paper>
            </Box>
        </Backdrop>
    
        */
}

export default Modal3D;