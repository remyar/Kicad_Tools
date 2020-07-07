import React from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux'
import {injectIntl} from 'react-intl';

import AppBar from './components/AppBar';
import Drawer from './components/Drawer';
import ProgressBar from './components/ProgressBar';

import HomePage from './pages/home';
import BomPage from './pages/bom';
import LibGeneratorPage from './pages/libGenerator';
import SettingsPage from './pages/settings';

import { withSnackbar } from 'notistack';

class App extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
            drawer : {
                open : false,
            },
            snackBar : []
        }
    }

    static getDerivedStateFromProps(props, state){
        if ( props.enqueueSnackbar != undefined ){
            props.snackBar.map((snk)=>{
                let found = false;
                state.snackBar.map((snck)=>{
                    if ( snck.time == snk.time ){
                        found = true;
                    }
                });

                if ( found == false ){
                    state.snackBar.push(snk);
                    let message = props.intl.formatMessage({id : snk.message});
                    if ( snk.messageSup != undefined){
                        message += snk.messageSup.toString();
                    }

                    snk.message = message;

                    props.enqueueSnackbar(snk.message , snk);
                }
            })
            
        }
        return state;
    }

    _openDrawer(){
        this.state.drawer.open = true;
        this.forceUpdate();
    }

    _closeDrawer(){
        this.state.drawer.open = false;
        this.forceUpdate();
    }
    render(){
        return <div>

            <AppBar onMenuOpen={this._openDrawer.bind(this)} />
            
            <div className="App">
                <Drawer open={this.state.drawer.open} onClose={this._closeDrawer.bind(this)}/>

                <ProgressBar open={this.props.progress.data.display} />

                <Route path='/' exact={true}  component={HomePage}/>
                <Route path='/bom' component={BomPage}/>
                <Route path='/settings' component={SettingsPage}/>
                <Route path='/lib_generator' component={LibGeneratorPage}/>
                
            </div>
        </div>
    }
}

function mapStateToProps(state){

    let autoDisplayProress = false;
    for ( let key in state ){
        let s = state[key];

        if ( s.isLoading && s.isLoading == true ){
            autoDisplayProress = true;
        }
    }

    let snackBar = [];
    for ( let key in state ){
        let s = state[key];

        if ( s.snackBar != undefined ){
            snackBar.push(s.snackBar);
        }
    }

    return {
        progress : { data : { display : autoDisplayProress } },
        snackBar : snackBar,
    }
}

export default connect(mapStateToProps)(withSnackbar(injectIntl(App)));