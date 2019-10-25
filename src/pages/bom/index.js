import React from 'react';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import {injectIntl} from 'react-intl';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import MemoryIcon from '@material-ui/icons/Memory';

import Actions from '../../actions';

const CustomTableCell = withStyles(theme => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14, 
    },
}))(TableCell);

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

class BomPage extends React.Component {
    constructor(props){
        super(props);
        this.state = { }
    }

    _openBom(){
        //this.props.dispatch(Actions.kicad_file.openKicadBomXml());
        this.props.dispatch(Actions.kicad_file.openKicadProject())
    }
    _exportBomToPdf() {
        this.props.dispatch(Actions.export_file.exportBomToPdf(this.props.KicadBom && this.props.KicadBom.data || {}))
    }

    render(){
        const classes = this.props.classes;
        const intl = this.props.intl;
        const components = this.props.KicadBom && this.props.KicadBom.data || {};

        return  <div className={classes.container}>
            <Button variant="contained" color="primary" onClick={this._openBom.bind(this)}>
                {intl.formatMessage({id : 'bom.load'})}
            </Button>
            <br />
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow style={{height : '30px' }}>
                            <CustomTableCell>
                            <Grid container spacing={24}>
                                    <Grid item xs={2}>
                                        {intl.formatMessage({id : 'bom.ident'})}
                                    </Grid>
                                    <Grid item xs={2}>
                                        {intl.formatMessage({id : 'bom.value'})}
                                    </Grid>
                                    <Grid item xs={1}>
                                        {intl.formatMessage({id : 'bom.quantity'})}
                                    </Grid>
                                    <Grid item xs={4}>
                                        {intl.formatMessage({id : 'bom.mfrnum'})}
                                    </Grid>

                                   {/*  <Grid item xs={2}>
                                        {intl.formatMessage({id : 'bom.ident'})}
                                    </Grid>
                                    <Grid item xs={2}>
                                        {intl.formatMessage({id : 'bom.value'})}
                                    </Grid>
                                    <Grid item xs={1}>
                                        {intl.formatMessage({id : 'bom.quantity'})}
                                    </Grid>
                                    <Grid item xs={3}>
                                        {intl.formatMessage({id : 'bom.mfrnum'})}
    </Grid>*/}
                                   <Grid item xs={1}>
                                        {intl.formatMessage({id : 'bom.punit'})}
                                    </Grid>
                                    <Grid item xs={1}>
                                        {intl.formatMessage({id : 'bom.ptotal'})}
                                    </Grid>
                                        <Grid item xs={1}>
                                    </Grid>
                                </Grid>
                            </CustomTableCell>
                        </TableRow>
                    </TableHead>
                </Table>
            </Paper>
            {(()=>{
                let rows = [];
                for ( let key in components ){

                    rows.push(  <Paper className={classes.root}>
                        <Table className={classes.table}>
                            <TableBody>
                                <TableRow className={classes.row} key={key} style={{backgroundColor : 'lightgrey'}}>
                                    <CustomTableCell component="th" scope="row" colSpan={6} >
                                        <Grid container spacing={24}>
                                            <Grid item xs={12}>
                                                {intl.formatMessage({id : key})}
                                            </Grid>
                                        </Grid>
                                    </CustomTableCell>
                                </TableRow>
                                {components[key].map((row, idx) => {
                                    return  <TableRow className={classes.row} key={row.type + '_value_' + idx}>
                                        <CustomTableCell component="th" scope="row">
                                            <Grid container spacing={24}>
                                                <Grid item xs={2}>
                                                    {row.refs.join(' ,')}
                                                </Grid>
                                                <Grid item xs={2}>
                                                    {row.val}
                                                </Grid>
                                                <Grid item xs={1}>
                                                    {row.nbRefs}
                                                </Grid>
                                                <Grid item xs={4}>
                                                    {row.mfrnum}
                                                </Grid>

                                         {/*       <Grid item xs={2}>
                                                    {row.refs.join(' ,')}
                                                </Grid>
                                                <Grid item xs={2}>
                                                    {row.val}
                                                </Grid>
                                                <Grid item xs={1}>
                                                    {row.nbRefs}
                                                </Grid>
                                                <Grid item xs={3}>
                                                    {row.mfrnum}
                                </Grid>*/}
                                                <Grid item xs={1}>
                                                    {row.unitPrice}
                                                </Grid>
                                                <Grid item xs={1}>
                                                    {row.totalPrice}
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <AddShoppingCartIcon style={{marginRight : "15px" , cursor : "pointer"}}/>
                                                    <MemoryIcon style={{marginRight : "15px" , cursor : "pointer"}}/>
                                                </Grid>
                                                
                                            </Grid>
                                        </CustomTableCell>
                                    </TableRow>
                                })}
                            </TableBody>
                        </Table>
                    </Paper>);
                }

                return rows;
            })()}
            <br />
            <Button variant="contained" color="primary" onClick={this._exportBomToPdf.bind(this)}>
                {intl.formatMessage({id : 'bom.export.pdf'})}
            </Button>            
        </div>
    }
}

function mapStateToProps(state){
    return {
        KicadBom : state.KicadBom,
    }
}
export default connect(mapStateToProps)(withStyles(styles)(injectIntl(BomPage)));