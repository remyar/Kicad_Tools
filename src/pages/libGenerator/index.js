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
import ExitToApp from '@material-ui/icons/ExitToApp';
import Save from '@material-ui/icons/Save';
import Reply from '@material-ui/icons/Reply';
import DeleteForever from '@material-ui/icons/DeleteForever';
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
    noselect: {
        userSelect: "none"
    }
});

class LibGeneratorPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedPath: undefined,
            savingLabrarie: false,
            isModified: false,
            existingLibrarie: undefined,
            addToLibrarie: [],
            allComponents: [],
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (state.isModified == false) {
            if (props.KicadLib && props.KicadLib.data && props.KicadLib.data.data) {
                let _lineLib = [];
                let componentFound = false;
                (props.KicadLib && props.KicadLib.data && props.KicadLib.data.data).split('\n').map((_line) => {
                    _line = _line.replace('\r', '');
                    if ( _line.startsWith("DEF") && _line.includes("#PWR") ){
                        componentFound = true;
                    }

                    if (componentFound == false) {
                        _lineLib.push(_line);
                    } else if (_line.startsWith("ENDDEF") == true) {
                        componentFound = false;
                    }
                });
                state.existingLibrarie = _lineLib.join("\n");
            }
            //state.existingLibrarie = (props.KicadLib && props.KicadLib.data && props.KicadLib.data.data);
        }
        return state;
    }
    _onUnselectCategorie() {
        if (this.state.selectedPath != undefined || this.state.selectedPath.length > 0) {
            if (this.state.selectedPath.indexOf('/') == -1) {
                this.state.selectedPath = undefined;
            } else {
                let endpath = this.state.selectedPath.substring(this.state.selectedPath.lastIndexOf('/'), this.state.selectedPath.length);
                this.state.selectedPath = this.state.selectedPath.replace(endpath, "");
            }

            this.forceUpdate();
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

    _createLibrarie() {
        this.props.dispatch(Actions.kicad_file.newKicadLibrarie());
    }

    _removeComponent(component) {
        let idx = this.state.addToLibrarie.findIndex((element) => element.mpn == component.mpn);
        if (idx != -1) {
            this.state.addToLibrarie.splice(idx, 1);
        } else {
            let newLibContent = [];
            let componentFound = false;

            this.state.existingLibrarie.split('\n').map((_line) => {

                _line = _line.replace('\r', '');

                if (_line.startsWith("DEF " + component.mpn) == true) {
                    componentFound = true;
                }

                if (componentFound == false) {
                    newLibContent.push(_line);
                } else if (_line.startsWith("ENDDEF") == true) {
                    componentFound = false;
                }
            });

            this.state.existingLibrarie = newLibContent.join('\n');
        }
        this.state.isModified = true;
        this.forceUpdate();
    }

    _addToLibrarie(component) {
        if (this.state.addToLibrarie.find((element) => element.mpn == component.name) == undefined) {

            if (this.state.existingLibrarie == undefined || this.state.existingLibrarie.split('\n').find((_line) => _line.startsWith("DEF " + component.name)) == undefined) {
                this.state.addToLibrarie.push({ mpn: component.name, description: component.description, ref: component.ref, path: component.path });
            }

        }
        this.forceUpdate();
    }

    async _saveLibrarie() {
        let myLibrariePath = (this.props.KicadLib && this.props.KicadLib.data && this.props.KicadLib.data.filename);
        let data = this.props.Github && this.props.Github.data ? this.props.Github.data : {};

        this.state.allComponents.map((component) => {

            let foundComponent = undefined;
            function _parse(componentName, obj) {
                if (Array.isArray(obj) == false) {

                    if (obj.hasOwnProperty(componentName) == true) {
                        foundComponent = obj[componentName][0];
                    } else {
                        for (let key in obj) {
                            _parse(componentName, obj[key]);
                        }
                    }
                }
            }
            _parse(component.mpn, data);
            component.path = foundComponent && foundComponent.path;
        });

        await this.props.dispatch(Actions.kicad_file.saveKicadLibrarie(myLibrariePath, this.state.addToLibrarie, this.state.existingLibrarie, this.state.allComponents));
        //await this.props.dispatch(Actions.kicad_file.downloadKicadFootprint(myLibrariePath , this.state.allComponents));
        this.state.savingLabrarie = true;
        this.state.isModified = false;
        this.state.addToLibrarie = [];
    }

    render() {

        const classes = this.props.classes;
        const intl = this.props.intl;
        let data = (this.props.Github != undefined && this.props.Github.data != undefined) ? this.props.Github.data : {};
        let myLibrarieFilename = (this.props.KicadLib && this.props.KicadLib.data && this.props.KicadLib.data.filename && this.props.KicadLib.data.filename.substring(this.props.KicadLib.data.filename.lastIndexOf(path.sep) + 1, this.props.KicadLib.data.filename.length));
        let myLibrarieComponent = [];

        if (this.state.existingLibrarie) {
            let _lines = this.state.existingLibrarie.split('\n');

            let _definition = {};
            _lines.map((_line, idx) => {
                _line = _line.replace('\r', '');

                if (_line.startsWith("DEF ")) {
                    _definition = {};
                }

                if (_line.startsWith("F0 ")) {
                    _definition.ref = _line.match(/\"([^\\"]|\\")*\"/gm)[0].replace(/\"/gm, "");
                }
                if (_line.startsWith("F2 ")) {
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
        this.state.allComponents = myLibrarieComponent;
        if (this.state.selectedPath != undefined) {
            let pathTab = this.state.selectedPath.split('/');
            pathTab.map((path) => {
                data = data[path];
            })
        }

        for (let key in data) {
            let obj = { name: key };
            if (Array.isArray(data[key]) == true) {
                obj = { ...obj, ...data[key][0] };
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

            <Grid container spacing={24} className={classes.noselect}>
                <Grid item xs={6} style={{ paddingRight: "8px" }}>
                    <Paper className={classes.root}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow style={{ height: '30px' }}>
                                    <CustomTableCell>
                                        <Grid container spacing={24}>
                                            <Grid item xs={11}>
                                                {intl.formatMessage({ id: 'lib.gen.type' })}
                                            </Grid>
                                            <Grid item xs={1} style={{ cursor: "pointer" }} onClick={this._onUnselectCategorie.bind(this)}>
                                                <Reply />
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
                                                {row.isComponent ? <Grid item xs={8} style={{ padding: "-10px" }} style={{ marginTop: "auto", marginBottom: "auto" }}>
                                                    {row.description}
                                                </Grid> : null}
                                                {row.isComponent ? <Grid item xs={1} style={{ padding: "-10px", cursor: "pointer" }} onClick={this._addToLibrarie.bind(this, row)}>
                                                    <ExitToApp />
                                                </Grid> : null}
                                            </Grid>
                                        </CustomTableCell>
                                    </TableRow>);
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                <Grid item xs={6} style={{ paddingLeft: "8px" }}>
                    <Paper className={classes.root}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow style={{ height: '30px' }}>
                                    <CustomTableCell>
                                        <Grid container spacing={24}>
                                            <Grid item xs={11}>
                                                {intl.formatMessage({ id: 'lib.myLib' })} : {myLibrarieFilename ? myLibrarieFilename : ""}
                                            </Grid>
                                            <Grid item xs={1} onClick={this._saveLibrarie.bind(this)} style={{ cursor: "pointer", color: ((this.state.addToLibrarie.length > 0) || (this.state.isModified == true)) ? "red" : "white", paddingLeft: "15px" }}>
                                                <Save />
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
                                                <Grid item xs={7} style={{ marginTop: "auto", marginBottom: "auto" }}>
                                                    {row.description}
                                                </Grid>
                                                <Grid item xs={1} style={{ marginTop: "auto", marginBottom: "auto", paddingLeft: "15px", cursor: "pointer" }}>
                                                    <DeleteForever onClick={this._removeComponent.bind(this, row)} />
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