import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';

import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Divider from '@mui/material/Divider';

import actions from '../../actions';

function SettingsPage(props) {
    let settings = props.globalState.settings;
    const intl = props.intl;

    return <Box>
        <Box sx={{ paddingLeft: "15px" }}>
            {intl.formatMessage({ id: 'settings.bom.title' })}
        </Box>
        <Divider></Divider>
        <List>
            {settings.bom.fields.map((field, idx) => {
                return <ListItem>
                    <ListItemText id="switch-list-label-wifi" >{field.name}</ListItemText>
                    <Switch defaultChecked={field.display ? true : false} onChange={async (event) => {
                        console.log(event.target.checked)
                        settings.bom.fields[idx].display = event.target.checked;
                        await props.dispatch(actions.settings.set('bom', settings.bom));
                    }}></Switch>
                </ListItem>
            })}
        </List>
    </Box >
}

export default withStoreProvider(withSnackBar(injectIntl(SettingsPage)));