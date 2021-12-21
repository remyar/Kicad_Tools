import React, { useState, useEffect } from 'react';
import { Route } from 'react-router-dom';

import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { withStoreProvider } from './providers/StoreProvider';

import routeMdw from './middleware/route';

import AppBar from './components/AppBar';
import Drawer from './components/Drawer';

import HomePage from './pages/home';
import LibGeneratorPage from './pages/libGenerator';

import actions from './actions'

const routes = [
    { path: routeMdw.urlIndex(), name: 'homePage', Component: HomePage },
    { path: routeMdw.urlLibGenerator(), name: 'LibGeneratorPage', Component: LibGeneratorPage },
]

function App(props) {
    const [drawerState, setDrawerState] = useState(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                let response = await props.dispatch(actions.electron.getUpdateAvailable());
                if (response?.updateAvailable?.version != undefined) {
                    let progress = await props.dispatch(action.electron.getUpdateProgress());
                    console.log(progress?.audapteProgress);
                }
            } catch (err) {

            }
        }, 2000);
        return () => clearInterval(interval);
    }, []);

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
export default withStoreProvider(App);

