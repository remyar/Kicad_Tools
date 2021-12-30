import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { withStoreProvider } from './providers/StoreProvider';
import { withSnackBar } from './providers/snackBar';
import routeMdw from './middleware/route';

import AppBar from './components/AppBar';
import Drawer from './components/Drawer';

import HomePage from './pages/home';
import LibGeneratorPage from './pages/libGenerator';
import BomPage from './pages/bom';
import PosPage from './pages/pos';

import electron from 'electron';

import actions from './actions'

const routes = [
    { path: routeMdw.urlIndex(), name: 'homePage', Component: HomePage },
    { path: routeMdw.urlLibGenerator(), name: 'LibGeneratorPage', Component: LibGeneratorPage },
    { path: routeMdw.urlBom(), name: 'BomPage', Component: BomPage },
    { path: routeMdw.urlPos(), name: 'PosPage', Component: PosPage },
]

function App(props) {

    const intl = props.intl;

    const [drawerState, setDrawerState] = useState(false);
    const [newVerion, setNewVersion] = useState(false);

    useEffect(()=>{
        electron.ipcRenderer.on('update-available', (event , message) => {
            //console.log(message)
            props.snackbar.warning(intl.formatMessage({ id: 'update.available' }));
        });
    
        electron.ipcRenderer.on('download-progress', (event , message) => {
            //console.log(message)
            props.snackbar.info(intl.formatMessage({ id: 'update.download' }) + ' : ' + parseInt(message?.percent || "0.0") + "%");           
        });
        
        electron.ipcRenderer.on('update-downloaded', (event , message) => {
            //console.log(message)
            props.snackbar.info(intl.formatMessage({ id: 'update.downloaded' }));

        });
    
        electron.ipcRenderer.on('update-quitForApply', (event , message) => {
            //console.log(message)
            props.snackbar.success(intl.formatMessage({ id: 'update.apply' }));
        });
    
        electron.ipcRenderer.on('update-error', (event , message) => {
            //console.log(message)
            props.snackbar.error(intl.formatMessage({ id: 'update.error' }));

        });
    },[])
    return <Box>
        <AppBar onClick={() => { setDrawerState(true) }} />
        <Box>
            <Container maxWidth="xl" sx={{ height: 'calc(100vh - 64px)', paddingTop: "25px" }} >
                <Drawer
                    open={drawerState}
                    onClose={() => { setDrawerState(false) }}
                />
                {routes.map(({ path, Component }) => (
                    <Route path={path} key={path} exact component={Component} />
                ))}
            </Container>
        </Box>
    </Box>
}
export default withStoreProvider(withSnackBar(injectIntl(App)));

