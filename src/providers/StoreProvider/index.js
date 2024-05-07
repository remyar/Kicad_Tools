
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Broadcast from './Broadcast'
import withStoreProvider from './withStoreProvider';

class Provider extends Component {
    static propTypes = {
        globalState: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);
        this.state = this.props.globalState;
        this.persistConfig = { persist: false, key: "root", ...this.props.persistConfig };
        if (this.persistConfig.persist && this.persistConfig.load ) {
           this.persistConfig.load();
        }
    }

    setStateAsync = async (d) => {
        return new Promise((resolve) => {
            this.setState(d, () => {
                resolve();
            })
        });
    }

    async __dispatch(updater, ...args) {
        if (updater && updater.constructor && updater.call && updater.apply) {
            let u = await updater(...args, async (d, ...a) => {
                return await this.__dispatch(d, ...a);
            }, () => {
                return this.state;
            }, this.props.extra);
            await this.setStateAsync({ ...this.state, ...u });
            if (this.persistConfig.persist && this.persistConfig.store) {
                if (this.persistConfig.whitelist !== undefined) {
                    let toSave = undefined;
                    this.persistConfig.whitelist.forEach((key) => {
                        if ( u[key] != undefined){
                            if ( toSave == undefined){
                                toSave = {};
                            }
                            toSave[key] = u[key];
                        }
                    });

                    if ( toSave != undefined ){
                        this.persistConfig.store(toSave);
                    }
                }
            }
            return u;
        }
    }

    createSetGlobalState = props => {
        return this.__dispatch.bind(this);
    }

    render() {
        return (
            <Broadcast globalState={this.state} createSetGlobalState={this.createSetGlobalState}>
                {this.props.children}
            </Broadcast>
        )
    }
}

export { withStoreProvider };
export default Provider