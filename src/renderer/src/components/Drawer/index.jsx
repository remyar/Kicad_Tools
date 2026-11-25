import Drawer from '@mui/material/Drawer';
import { useIntl } from 'react-intl';
import List from '@mui/material/List';

import { useNavigate } from "react-router";

import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import FileCopyIcon from '@mui/icons-material/FileCopy';

import Routes from 'routes';

function My_drawer(props) {
    const intl = useIntl();
    const navigation = useNavigate();

    return <Drawer open={props.open || false} onClose={async () => { props.onClose && await props.onClose() }}>
        <List>
            <ListItem button onClick={async () => {
                navigation(Routes.urlLibGenerator());
                props.onClose && await props.onClose();
            }}>
                <ListItemIcon>
                    <FileCopyIcon />
                </ListItemIcon>
                <ListItemText primary={intl.formatMessage({ id: 'nav.generate.librarie' })} secondary={intl.formatMessage({ id: 'nav.generate.librarie.desc' })} />
            </ListItem>
        </List>
    </Drawer>
}

export default My_drawer;