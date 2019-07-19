
import React from 'react';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import {injectIntl} from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

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
    _openBom(){

    }
    render(){
        const classes = this.props.classes;
        const intl = this.props.intl;

        return <div className={classes.container}>
                <div className={classes.root} >
                    <Grid container spacing={24}>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={2}>Logo : </Grid>
                        <Grid item xs={2} width="100%">
                            <Card >
                                <CardContent style={{marginBottom:'-5px'}}>
                                    <img src="https://material-ui.com/static/images/grid-list/breakfast.jpg" width="100%"/>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={4}></Grid>
                    </Grid>
                    <br />
                    <Grid container spacing={24}>
                        <Grid item xs={4}></Grid>
                        <Grid item xs={2}></Grid>
                        <Grid item xs={2}>

                        <Button variant="contained" color="primary" onClick={this._openBom.bind(this)}>
                            {intl.formatMessage({id : 'logo.change'})}
                        </Button>

                        </Grid>
                        <Grid item xs={4}></Grid>
                    </Grid>
                </div>
            </div>;
    }
}

function mapStateToProps(state){
    return {
    }
}
export default connect(mapStateToProps)(withStyles(styles)(injectIntl(SettingsPage)));