import React, { PureComponent } from 'react';
import { withSnackbar } from "notistack";
import { injectIntl } from 'react-intl';
import ReactSnackBarContext from './context';

function SnackBar(props) {

    function _error(messageKey) {
        props.enqueueSnackbar(props.intl.formatMessage({ id: messageKey }), { variant: "error", persist: false });
    }

    function _warning(messageKey) {
        props.enqueueSnackbar(props.intl.formatMessage({ id: messageKey }), { variant: "warning", persist: false });
    }

    function _success(messageKey) {
        props.enqueueSnackbar(props.intl.formatMessage({ id: messageKey }), { variant: "success", persist: false });
    }

    function _info(messageKey) {
        props.enqueueSnackbar(props.intl.formatMessage({ id: messageKey }), { variant: "info", persist: false });
    }

    return <ReactSnackBarContext.Provider value={{
        snackbar: {
            error: _error.bind(this),
            warning: _warning.bind(this),
            success : _success.bind(this),
            info : _info.bind(this),
        }
    }}>
        {props.children}
    </ReactSnackBarContext.Provider>;
}

export default withSnackbar(injectIntl(SnackBar));