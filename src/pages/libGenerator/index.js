import React from 'react';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import {injectIntl} from 'react-intl';
import Actions from '../../actions';

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
    row: {
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.background.default,
        },
        height :  '28px'
    },
    table: {
        minWidth: 700,
        overflow : 'Hidden',
    },
});

class LibGeneratorPage extends React.Component {
    constructor(props){
        super(props);
        this.state = { }
    }

    componentDidMount(){
        this.props.dispatch(Actions.github.getGithubAllCategories())
    }
    render(){
        const classes = this.props.classes;
        const intl = this.props.intl;

        return <div className={classes.container}>
            hello world
        </div>;
    }
}

function mapStateToProps(state){
    return {
        Github : state.Github,
    }
}
export default connect(mapStateToProps)(withStyles(styles)(injectIntl(LibGeneratorPage)));