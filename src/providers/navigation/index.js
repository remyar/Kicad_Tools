import React, { PureComponent } from 'react';
import ReactNavigationContext from './context';
import withNavigation from './withNavigation';
import { useHistory } from "react-router-dom";


function NavigationProvider(props) {

    let history = useHistory();

    window.onpopstate = () => {
        _goBack()
    }

    function _push(_link, _state) {
        history.push(_link , _state);
        window.history.pushState(_state, "state");
    }

    function _goBack() {
        history.goBack();
    }

    function _getPath(){
        return history.location.pathname;
    }

    return <ReactNavigationContext.Provider value={{
        navigation: {
            push: _push.bind(this),
            goBack: _goBack.bind(this),
            getPath : _getPath.bind(this),
        }
    }}>
        {props.children}
    </ReactNavigationContext.Provider >;
}

export { withNavigation };
export default NavigationProvider;