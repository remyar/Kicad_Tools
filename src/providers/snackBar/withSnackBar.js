import React, { Component } from 'react';

import ReactSnackBarContext from './context';

export default (WrappedComponent) => {

    class WithSnackBarComponent extends Component {

        renderWrappedComponent = ({ snackbar }) => (
            <WrappedComponent {...this.props} snackbar={snackbar} />
        );

        render() {
            return <ReactSnackBarContext.Consumer>{this.renderWrappedComponent}</ReactSnackBarContext.Consumer>;
        }
    }

    return WithSnackBarComponent;
}
