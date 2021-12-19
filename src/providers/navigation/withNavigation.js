import React, { Component } from 'react';

import ReactNavigationContext from './context';

export default (WrappedComponent) => {

    class WithNavigationComponent extends Component {

        renderWrappedComponent = ({ navigation }) => (
            <WrappedComponent {...this.props} navigation={navigation} />
        );

        render() {
            return <ReactNavigationContext.Consumer>{this.renderWrappedComponent}</ReactNavigationContext.Consumer>;
        }
    }

    return WithNavigationComponent;
}

