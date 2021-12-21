import React from 'react';
import { SnackbarProvider } from 'notistack';
import SnackBar from './snackbar';
import withSnackBar from './withSnackBar';

function SnackBarGenerator(props) {

    return <SnackbarProvider maxSnack={1}>
        <SnackBar>{props.children}</SnackBar>
    </SnackbarProvider>;
}

export { withSnackBar };
export default SnackBarGenerator;
