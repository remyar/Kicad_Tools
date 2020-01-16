import React from 'react';
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles';
import { injectIntl } from 'react-intl';
import Actions from '../../actions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import FolderIcon from '@material-ui/icons/Folder';
import { remote } from 'electron';

const fs = remote.require('fs');
const path = window.require('path');

const CustomTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const styles = theme => ({
    container: {
        width: '95%',
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: '63px',
        marginBottom: '15px',
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
        height: '28px',
    },
    table: {
        minWidth: 700,
        overflow: 'Hidden',
    },
});

class LibGeneratorPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedPath: undefined,
            addToLibrarie: []
        }
    }

    _onSelectCategorie(name) {
        let selectedPath = this.state.selectedPath || "";
        if (selectedPath.length > 0) {
            selectedPath += '/';
        }
        selectedPath += name;
        this.setState({ selectedPath: selectedPath });
    }

    componentDidMount() {
        this.props.dispatch(Actions.github.getGithubAllCategories());
    }

    _openLibrarie() {
        this.props.dispatch(Actions.kicad_file.openKicadLibraire());
    }

    _createLibrarie(){
        this.props.dispatch(Actions.kicad_file.newKicadLibrarie());
    }

    _addToLibrarie(component) {
        this.state.addToLibrarie.push({ mpn : component.name , description : component.description , ref : component.ref});
        this.forceUpdate();
    }

    render() {

        const classes = this.props.classes;
        const intl = this.props.intl;
        let data = (this.props.Github != undefined && this.props.Github.data != undefined) ? this.props.Github.data : {};
        let myLibrarieFilename = (this.props.KicadLib && this.props.KicadLib.data && this.props.KicadLib.data.filename && this.props.KicadLib.data.filename.substring(this.props.KicadLib.data.filename.lastIndexOf(path.sep) + 1, this.props.KicadLib.data.filename.length));
        let myLibrarieComponent = [];

        if (this.props.KicadLib && this.props.KicadLib.data && this.props.KicadLib.data.data) {
            let _lines = this.props.KicadLib.data.data.split('\n');

            let _definition = {};
            _lines.map((_line, idx) => {
                _line = _line.replace('\r', '');

                if (_line.startsWith("DEF ")) {
                    _definition = {};
                }

                if (_line.startsWith("F0 ")) {
                    _definition.ref = _line.match(/\"([^\\"]|\\")*\"/gm)[0].replace(/\"/gm, "");
                }
                if (_line.startsWith("F1 ")) {
                    _definition.mpn = _line.match(/\"([^\\"]|\\")*\"/gm)[0].replace(/\"/gm, "");
                }
                if (_line.startsWith("F4 ")) {
                    _definition.description = _line.match(/\"([^\\"]|\\")*\"/gm)[0].replace(/\"/gm, "");
                }

                if (_line.startsWith("ENDDEF")) {
                    myLibrarieComponent.push(_definition);
                }
            });
        }

        this.state.addToLibrarie.map((component) => {
            myLibrarieComponent.push(component)
        });

        let rows = [];

        if (this.state.selectedPath != undefined) {
            let pathTab = this.state.selectedPath.split('/');
            pathTab.map((path) => {
                data = data[path];
            })
        }

        for (let key in data) {
            let obj = { name: key };
            if (Array.isArray(data[key]) == true) {
                obj = { ...obj , ...data[key][0] };
                obj.isComponent = true;
                obj.description = data[key][0].description || "";
            }
            rows.push(obj);
        }

        return <div className={classes.container}>
            <Grid container spacing={24}>
                <Grid item xs={2} style={{ marginRight: "15px" }}>
                    <Button variant="contained" color="primary" onClick={this._createLibrarie.bind(this)} style={{ width: "100%" }}>
                        {intl.formatMessage({ id: 'lib.new' })}
                    </Button>
                </Grid>
                <Grid item xs={2} >
                    <Button variant="contained" color="primary" onClick={this._openLibrarie.bind(this)} style={{ width: "100%" }}>
                        {intl.formatMessage({ id: 'lib.load' })}
                    </Button>
                </Grid>
            </Grid>

            <br></br>

            <Grid container spacing={24}>
                <Grid item xs={5}>
                    <Paper className={classes.root}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow style={{ height: '30px' }}>
                                    <CustomTableCell>
                                        <Grid container spacing={24}>
                                            <Grid item xs={12}>
                                                {intl.formatMessage({ id: 'lib.gen.type' })}
                                            </Grid>
                                        </Grid>
                                    </CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, idx) => {
                                    return (<TableRow className={classes.row} key={'_categorie_' + idx} onClick={row.isComponent ? () => { } : this._onSelectCategorie.bind(this, row.name)}>
                                        <CustomTableCell component="th" scope="row">
                                            <Grid container spacing={24}>
                                                <Grid item xs={row.isComponent ? 3 : 12} style={{ marginTop: "auto", marginBottom: "auto" }}>
                                                    {row.name}
                                                </Grid>
                                                {row.isComponent ? <Grid item xs={7} style={{ padding: "-10px" }} style={{ marginTop: "auto", marginBottom: "auto" }}>
                                                    {row.description}
                                                </Grid> : null}
                                                {row.isComponent ? <Grid item xs={2} style={{ padding: "-10px" }}>
                                                    <Button variant="contained" color="primary" onClick={this._addToLibrarie.bind(this, row)}>
                                                        {intl.formatMessage({ id: 'lib.gen.addToLib' })}
                                                    </Button></Grid> : null}
                                            </Grid>
                                        </CustomTableCell>
                                    </TableRow>);
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={6}>
                    <Paper className={classes.root}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow style={{ height: '30px' }}>
                                    <CustomTableCell>
                                        <Grid container spacing={24}>
                                            <Grid item xs={9}>
                                                {intl.formatMessage({ id: 'lib.myLib' })} : {myLibrarieFilename ? myLibrarieFilename : ""}
                                            </Grid>
                                            <Grid item xs={3}>
                                            <Button variant="contained" color="primary" onClick={this._createLibrarie.bind(this)} style={{ width: "100%" }}>
                        {intl.formatMessage({ id: 'lib.save' })}
                    </Button>
                                            </Grid>
                                        </Grid>
                                    </CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {myLibrarieComponent.map((row, idx) => {
                                    return (<TableRow className={classes.row} key={'_libraire_component_' + idx} >
                                        <CustomTableCell component="th" scope="row">
                                            <Grid container spacing={24}>
                                                <Grid item xs={3} style={{ marginTop: "auto", marginBottom: "auto" }}>
                                                    {row.mpn}
                                                </Grid>
                                                <Grid item xs={1} style={{ marginTop: "auto", marginBottom: "auto" }}>
                                                    {row.ref}
                                                </Grid>
                                                <Grid item xs={8} style={{ marginTop: "auto", marginBottom: "auto" }}>
                                                    {row.description}
                                                </Grid>
                                            </Grid>
                                        </CustomTableCell>
                                    </TableRow>)
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>

        </div >;
    }
}

function mapStateToProps(state) {
    return {
        Github: state.Github,
        KicadLib: state.KicadLib,
    }
}
export default connect(mapStateToProps)(withStyles(styles)(injectIntl(LibGeneratorPage)));