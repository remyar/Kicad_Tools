import React, { useState, useEffect } from 'react';

import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import AssessmentIcon from '@mui/icons-material/Assessment';

function MyDrawer(props) {
    return <Drawer open={props.open} onClose={() => { props.onClose && props.onClose() }}>
        <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                <ListItem button key={text}>
                    <ListItemIcon>
                        {index % 2 === 0 ? <ArrowCircleRightIcon /> : <AssessmentIcon />}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                </ListItem>
            ))}
        </List>
    </Drawer>;
}


export default MyDrawer;