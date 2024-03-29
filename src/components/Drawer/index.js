import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { withNavigation } from '../../providers/navigation';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import MemoryIcon from '@mui/icons-material/Memory';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import HomeIcon from '@mui/icons-material/Home';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import SettingsIcon from '@mui/icons-material/Settings';

import routeMdw from '../../middleware/route';

function MyDrawer(props) {
    const intl = props.intl;
    return <Drawer open={props.open} onClose={() => { props.onClose && props.onClose() }}>
        <List>

            <ListItem button onClick={() => {
                props.navigation.push(routeMdw.urlLibGenerator());
                props.onClose && props.onClose();
            }}>
                <ListItemIcon>
                    <FileCopyIcon />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'nav.generate.librarie' })} secondary={intl.formatMessage({ id: 'nav.generate.librarie.desc' })} />
            </ListItem>
            <ListItem button onClick={() => {
                props.navigation.push(routeMdw.urlBom());
                props.onClose && props.onClose();
            }}>
                <ListItemIcon>
                    <MemoryIcon />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'nav.generate.bom' })} secondary={intl.formatMessage({ id: 'nav.generate.bom.desc' })} />
            </ListItem>
            <ListItem button onClick={() => {
                props.navigation.push(routeMdw.urlPos());
                props.onClose && props.onClose();
            }}>
                <ListItemIcon>
                    <EditLocationIcon />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'nav.generate.pos' })} secondary={intl.formatMessage({ id: 'nav.generate.pos.desc' })} />
            </ListItem>
            <ListItem button onClick={() => {
                props.navigation.push(routeMdw.urlIndex());
                props.onClose && props.onClose();
            }}>
                <ListItemIcon>
                    <HomeIcon />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'nav.home' })} secondary={intl.formatMessage({ id: 'nav.home.desc' })} />
            </ListItem>

        </List>
        <List sx={{ position: "absolute", bottom: "0px", width: "100%" }}>
            <ListItem button onClick={() => {
                props.navigation.push(routeMdw.urlSettings());
                props.onClose && props.onClose();
            }} >
                <ListItemIcon>
                    <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'nav.settings' })} secondary={intl.formatMessage({ id: 'nav.settings.desc' })} />
            </ListItem>
        </List>
    </Drawer>;
}


export default withNavigation(injectIntl(MyDrawer));