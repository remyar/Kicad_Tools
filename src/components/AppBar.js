import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/icons/Menu';
const styles = {
    root: {
        flexGrow: 1,
        margin : "0px",
        fontFamily: 'Roboto',
    },
    appbar: {
        background: 'linear-gradient(to right, #0086C9, #4BC9EC);'
    },
    menuButton: {
        marginLeft: -18,
        marginRight: 10,
    },
    apptitle: {
        flexGrow: 1,
        textAlign:'right'
    },
    container : {
        position:'fixed',
        top : 0,
        left : 0,
        width : '100%',
        zIndex: 1
    }
}

class MyAppBar extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            is_open : false,
        }
    }

    _onMenuOpen(){
        if ( this.props.onMenuOpen != undefined ){
            this.props.onMenuOpen();
        }
    }

    render(){
        const classes = this.props.classes;

        return <div className={classes.container}>
            <AppBar position="" >
            <Toolbar className={classes.root} variant="dense">
                <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={this._onMenuOpen.bind(this)}>
                    <Menu />
                </IconButton>     
                <Typography variant="title" color="inherit" className={classes.apptitle}>
                    Kicad Tools {APP_VERSION}
                </Typography>
            </Toolbar>
        </AppBar>
        </div>
    }
}

export default withStyles(styles)(MyAppBar);