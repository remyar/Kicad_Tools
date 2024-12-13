import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { withStoreProvider } from '@remyar/react-store';

import Router from './routes';

import HomePage from './pages/home';
import Box from '@mui/material/Box';

const routes = [
    { path: Router.urlIndex(), name: 'Home', Component: <HomePage /> },
];

function App(props) {
    return <Box sx={{ display: 'flex' }} >
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes >
                {routes.map(({ path, Component }) => (
                    <Route path={path} key={path} element={Component} />
                ))}
            </Routes>
        </Box>
    </Box>;
}

export default withStoreProvider(App);