import React, { useState, useEffect } from 'react';

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

function Modal3D(props) {

    const models3d = props.models3d || [];
    const [SelectedModel, setSelectedModel] = useState(models3d[0]);

    const [dimensions, setDimensions] = React.useState({
        height: window.innerHeight,
        width: window.innerWidth
    })
    React.useEffect(() => {
        function handleResize() {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth
            })

        }

        window.addEventListener('resize', handleResize)

        return _ => {
            window.removeEventListener('resize', handleResize)

        }
    });

    let heightModel = (dimensions.height * 0.6).toString() + "px"
    return <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={props.display}
        onClick={() => { }}

    >
        <Box sx={{ width: "100vh", height: { heightModel } }}>
            <Paper sx={{ padding: "15px", height: { heightModel } }}>
                <Select onChange={(event) => {
                    let model = JSON.parse(event.target.value);
                    setSelectedModel(model)
                }}
                    sx={{
                        width: '100%'
                    }}
                >
                    {models3d.map((model) => {
                        return <MenuItem value={JSON.stringify(model)}>{model.title || ""}</MenuItem >
                    })}
                </Select>
                <br/><br/>
                <iframe className="dlgLibs-thumb4 for3dview" width="100%" height={heightModel} src={"https://easyeda.com/editor/6.4.32/htm/editorpage15.html?version=6.4.32&url=" + SelectedModel?.dataStr?.head?.url}>
                    <script src="https://easyeda.com/editor/6.4.32/js/jsapi.min.js"></script>
                    <div id="canvas">
                        <canvas width="100%" height="100%" sx={{ width: "100%", height: "100%", backgroundColor: "white" }}></canvas>
                    </div>
                </iframe>
                <Button
                    sx={{
                        width: '100%'
                    }}
                    variant="contained" onClick={async () => { props.onClose && props.onClose(SelectedModel); }}> Select This Model</Button>
            </Paper>
        </Box>
    </Backdrop>
}

export default Modal3D;