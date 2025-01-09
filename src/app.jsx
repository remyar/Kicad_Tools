import { useState } from 'react';
import { Routes, Route } from 'react-router';

import Router from './routes';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import AppBar from './components/AppBar';
import Drawer from './components/Drawer';

import HomePage from './pages/home';
import LibGeneratorPage from './pages/libGenerator';

const routes = [
    { path: Router.urlIndex(), name: 'Home', Component: <HomePage /> },
    { path: Router.urlLibGenerator(), name: 'LibGeneratorPage', Component: <LibGeneratorPage /> },

];

function App(props) {

    const [drawerState, setDrawerState] = useState(false);

    return <Box  >
        <AppBar onClick={() => { setDrawerState(true) }} />
        <Box sx={{ paddingTop: '64px' }} >
            <Container maxWidth="xl" sx={{ paddingTop: "25px" }} >
                <Drawer
                    open={drawerState}
                    onClose={() => { setDrawerState(false) }}
                />
                <Routes >
                    {routes.map(({ path, Component }) => (
                        <Route path={path} key={path} element={Component} />
                    ))}
                </Routes>
            </Container>
        </Box>
    </Box>;
}

export default App;