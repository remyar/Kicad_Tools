import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {injectIntl} from 'react-intl';
import {  Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

const styles = theme  => ({
    container : {
        position:'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
    },
    button: {
        margin: theme.spacing.unit,
        width: '100%',
    },
    noStyle : {
        textDecoration : 'none',
    },
});

class HomePage extends React.Component {
    constructor(props){
        super(props);
        this.state = { }
    }

    render(){
        const classes = this.props.classes;
        const intl = this.props.intl;

        return <div className={classes.container}>
                    <Link to="/bom" className={classes.noStyle}>
                        <Button variant="contained" color="primary" className={classes.button}>{intl.formatMessage({id : 'nav.generate.bom'})}</Button>
                    </Link>
                    <br />
                    <Link to="/lib_generator" className={classes.noStyle}>
                        <Button variant="contained" color="primary" className={classes.button}>{intl.formatMessage({id : 'nav.generate.librarie' })}</Button>
                    </Link>
                   {/* <br />
                    <Link to="/convert_pcb_to_footprint" className={classes.noStyle}>
                        <Button variant="contained" color="primary" className={classes.button}>{intl.formatMessage({id : 'nav.eagle.convertPcbToFootprint'})}</Button>
                    </Link>*/}
        </div>
    }
}

export default (withStyles(styles)(injectIntl(HomePage)));