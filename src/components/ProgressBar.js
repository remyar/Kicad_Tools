import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import LinearProgress from '@material-ui/core/LinearProgress';
import {injectIntl} from 'react-intl';
import Grid from '@material-ui/core/Grid';

const styles = {
};

class MyProgressBar extends React.Component {

    constructor(props){
        super(props);
        this.state = {}
    }

    render(){
        const classes = this.props.classes;
        const intl = this.props.intl;

        return <Dialog open={this.props.open} aria-labelledby="responsive-dialog-title">
            <DialogTitle id="responsive-dialog-title">{intl.formatMessage({id : 'progress.title'})}</DialogTitle>        
            <DialogContent>
                <LinearProgress />
            </DialogContent>
        </Dialog>
    }
    
}

export default withStyles(styles)(injectIntl(MyProgressBar));