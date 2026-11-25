import { useEffect, useState } from 'react';
import { useStore } from '@remyar/react-store';
import { Routes, Route, useLocation, useNavigate } from 'react-router';
import { useIntl } from 'react-intl';
import { withSnackBar } from '@remyar/react-snackbar';

import Box from '@mui/material/Box';

import AppBar from 'components/AppBar';
import Drawer from 'components/Drawer';

import Router from 'routes';

import HomePage from 'pages/home';
import LibGeneratorPage from 'pages/libGenerator';

const routes = [
    { path: Router.urlIndex(), name: 'Index', Component: <HomePage /> },
    { path: Router.urlLibGenerator(), name: 'Index', Component: <LibGeneratorPage /> },
];
function App(props) {

    const [drawerState, setDrawerState] = useState(false);

    return <Box >
        <AppBar onClick={() => { setDrawerState(true) }} />
        <Box component="main" sx={{ flexGrow: 1, p: 3, paddingTop: "30px" }}>
            <Drawer
                open={drawerState}
                onClose={() => { setDrawerState(false) }}
            />
            <Routes >
                {routes.map(({ path, Component }) => (
                    <Route path={path} key={path} exact element={Component} />
                ))}
            </Routes>
        </Box>
    </Box>
}

export default withSnackBar(App);