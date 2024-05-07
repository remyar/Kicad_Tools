import React, { Component, useEffect } from 'react'
import PropTypes from 'prop-types'

const withStoreProvider = WrappedComponent => {
    class withStoreProvider extends Component {

        static contextTypes = {
            globalState: PropTypes.object.isRequired,
            createSetGlobalState: PropTypes.func.isRequired
        }

        state = null;

        syncStateWithGlobalState = globalState => {
            this.setState(globalState)
        }

        render() {
            if (this.state == null) {
                this.state = this.context.globalState.getState();
                this.context.globalState.subscribe(this.syncStateWithGlobalState);
            }
            return (
                <WrappedComponent
                    {...this.props}
                    globalState={this.state}
                    dispatch={this.context.createSetGlobalState(this.props)}
                />
            )
        }
    }

    return withStoreProvider
}

export default withStoreProvider