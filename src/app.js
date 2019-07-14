import React from 'react';
import { Route } from 'react-router';
import { connect } from 'react-redux'

import AppBar from './components/AppBar';
import Drawer from './components/Drawer';
import ProgressBar from './components/ProgressBar';

import HomePage from './pages/home';
import BomPage from './pages/bom'

class App extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
            drawer : {
                open : false,
            }
        }
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
    return {
        progress : { data : { display : autoDisplayProress } }
    }
}

export default connect(mapStateToProps)(App);