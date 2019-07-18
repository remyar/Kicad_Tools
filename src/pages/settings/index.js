
import React from 'react';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import {injectIntl} from 'react-intl';


const styles = theme  => ({
    container : {
        width : '95%',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop : '63px',
        marginBottom : '15px',
    },
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
});

class SettingsPage extends React.Component {
    constructor(props){
        super(props);
        this.state = { }
    }

    render(){
        const classes = this.props.classes;
        const intl = this.props.intl;

        return <div className={classes.container}>
                hello
            </div>;
    }
}

function mapStateToProps(state){
    return {
    }
}
export default connect(mapStateToProps)(withStyles(styles)(injectIntl(SettingsPage)));