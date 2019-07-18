import React from 'react';
import { Redirect, Link, Route, Switch } from 'react-router-dom';
import {injectIntl} from 'react-intl';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import AccountCircle from '@material-ui/icons/AccountCircle';
import Home from '@material-ui/icons/Home';
import Memory from '@material-ui/icons/Memory';
import Settings from '@material-ui/icons/Settings';

const styles = {
    drawerStyle : {
        width : '25%',
        maxWidth : "25%",
        minWidth : '240px',
        flexShrink: 0,
    },
    noStyle : {
        textDecoration : 'none',
    }
};

class MyDrawer extends React.Component {

    constructor(props){
        super(props);
        this.state = { 
        }
    }

    _onClose(){
        if ( this.props.onClose != undefined ){
            this.props.onClose();
        }
    }

    render(){
        const classes = this.props.classes;
        const intl = this.props.intl;

        return  <Drawer  className={classes.drawerStyle} classes={{ paper: classes.drawerStyle }} open={this.props.open} onClose={this._onClose.bind(this)}>
            <div tabIndex={0} role="button" onClick={this._onClose.bind(this)} onKeyDown={this._onClose.bind(this)} >
                <List component="nav">

                    <Link to="/bom" className={classes.noStyle}>
                        <ListItem button >
                            <ListItemIcon>
                                <Memory />
                            </ListItemIcon>

                            <ListItemText primary={intl.formatMessage({id : 'nav.generate.bom'})}  secondary={intl.formatMessage({id : 'nav.generate.bom.desc'})}  />

                        </ListItem>
                    </Link>

                    <Link to="/settings" className={classes.noStyle}>
                        <ListItem button >
                            <ListItemIcon>
                                <Settings />
                            </ListItemIcon>

                            <ListItemText primary={intl.formatMessage({id : 'nav.settings'})}  secondary={intl.formatMessage({id : 'nav.settings.desc'})}  />

                        </ListItem>
                    </Link>


                  {/*  <Link to="/convert_eagle_lib" className={classes.noStyle}>
                        <ListItem button >
                            <ListItemIcon>
                                <AccountCircle />
                            </ListItemIcon>

                            <ListItemText primary={intl.formatMessage({id : 'nav.eagle.convert'})}  secondary={intl.formatMessage({id : 'nav.eagle.convert.desc'})}  />

                        </ListItem>
                    </Link>
                */}
                    <Link to="/" className={classes.noStyle}>
                        <ListItem button >
                            <ListItemIcon>
                                <Home />
                            </ListItemIcon>

                            <ListItemText primary={intl.formatMessage({id : 'nav.home'})}  secondary={intl.formatMessage({id : 'nav.home.desc'})}  />

                        </ListItem>
                    </Link>
                </List>
            </div>
        </Drawer>
    }

    
}

export default withStyles(styles)(injectIntl(MyDrawer));