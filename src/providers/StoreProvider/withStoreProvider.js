import React, { Component } from 'react'
import PropTypes from 'prop-types'

const withStoreProvider = WrappedComponent => {
    class withStoreProvider extends Component {
        static displayName = `withStoreProvider(${WrappedComponent.displayName || WrappedComponent.name || 'Component'
            })`

        static contextTypes = {
            globalState: PropTypes.object.isRequired,
            createSetGlobalState: PropTypes.func.isRequired
        }

        state = null

        syncStateWithGlobalState = globalState => {
            this.setState(globalState)
        }

        componentWillMount() {
            this.setState(this.context.globalState.getState())
        }

        componentDidMount() {
            this.context.globalState.subscribe(this.syncStateWithGlobalState)
        }

        componentWillUnmount() {
            this.context.globalState.unsubscribe(this.syncStateWithGlobalState)
        }

        render() {
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