import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';

import { styled } from '@mui/material/styles';

import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import Loader from '../../components/Loader';

import Box from '@mui/material/Box';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import SaveIcon from '@mui/icons-material/Save';
import FileOpenIcon from '@mui/icons-material/FileOpen';

import actions from '../../actions';

import utils from '../../utils';

import Paper from '@mui/material/Paper';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function BomPage(props) {
    const [displayLoader, setDisplayLoader] = useState(false);
    const [components, setComponents] = useState([]);
    const settings = props.globalState.settings;

    let fields = [];

    let standardField = [
        { name: 'Ref', display: true, value: "" },
        { name: 'Quantity', display: true, value: 0 },
        { name: 'Value', display: true, value: "" },
        { name: 'Footprint', display: true, value: "" },
    ]

    useEffect(() => {
        let settings = props.globalState.settings;
        let settingsBom = settings.bom || { fields: [] };

        standardField.map((field) => {
            if (settingsBom.fields.find((f) => f.name == field.name) == undefined) {
                field.display = true;
                settingsBom.fields.push(field);
            }
        })

        components?.UniquePartList?.map((component) => {
            component?.Fields.map((field) => {
                if (settingsBom.fields.find((f) => f.name == field.name) == undefined) {
                    field.display = true;
                    settingsBom.fields.push(field);
                }
            })
        });
        props.dispatch(actions.settings.set('bom', { ...settingsBom }));
    }, [components]);


    return <Box>
        <Loader display={displayLoader} />

        <TableContainer component={Paper}>
            <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {standardField.map((field) => {
                            if (fields.find((f) => f.name == field.name) == undefined) {
                                let fieldSettings = settings?.bom?.fields?.find((f) => f.name == field.name);
                                if (fieldSettings == undefined || fieldSettings.display == true) {
                                    //fields.push(field);
                                    return <StyledTableCell>{field.name}</StyledTableCell>
                                }
                            }
                        })}
                        {components?.UniquePartList?.map((component) => {
                            let res = [];
                            component?.Fields.map((field) => {
                                if (fields.find((f) => f.name == field.name) == undefined) {
                                    let fieldSettings = settings?.bom?.fields?.find((f) => f.name == field.name)
                                    if (fieldSettings == undefined || fieldSettings.display == true) {
                                        res.push(<StyledTableCell>{field.name}</StyledTableCell>);
                                        fields.push(field);
                                    }
                                }
                            })
                            return res;
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {components?.UniquePartList?.map((component) => {
                        let cells = [];
                        let refs = [];

                        component.Ref.forEach(element => {
                            refs.push(component.RefPrefix + element);
                        });

                        (standardField.find((f) => f.name == 'Ref')).value = refs.join(', ');
                        (standardField.find((f) => f.name == 'Quantity')).value = component.Count;
                        (standardField.find((f) => f.name == 'Value')).value = component.Value.toString();
                        (standardField.find((f) => f.name == 'Footprint')).value = component.Footprint;

                        fields.map((field) => {
                            let value = component?.Fields && component?.Fields?.find((f) => f.name == field.name)?.value;
                            if (value == undefined) {
                                value = standardField.find((f) => f.name == field.name)?.value || "";
                            }
                            cells.push(<StyledTableCell >{value}</StyledTableCell >);
                        })
                        return <StyledTableRow key={component.Value.toString()}>{cells}</StyledTableRow>;
                    })}
                </TableBody>
            </Table>
        </TableContainer>

        <SpeedDial
            ariaLabel="SpeedDial basic example"
            sx={{ position: 'absolute', bottom: 16, right: 16 }}
            icon={<SpeedDialIcon />}
        >
            <SpeedDialAction
                key={'Open'}
                icon={<FileOpenIcon />}
                tooltipTitle={'Open'}
                onClick={async () => {
                    setDisplayLoader(true);
                    try {
                        let file = (await props.dispatch(actions.electron.getFilenameForOpen('.net')))?.getFilenameForOpen;
                        if (file.canceled == false) {
                            let fileData = (await props.dispatch(actions.electron.readFile(file.filePath)))?.fileData;
                            let _components = await utils.kicad.parseKicadNetlist(fileData);
                            setComponents(_components);
                        }
                    } catch (err) {
                        props.snackbar.error(err.message);
                    }
                    setDisplayLoader(false);
                }}>
            </SpeedDialAction>

            <SpeedDialAction
                key={'Save'}
                icon={<SaveIcon />}
                tooltipTitle={'Save'}
                onClick={async () => {
                    setDisplayLoader(true);
                    try {
                        let filename = (await props.dispatch(actions.electron.getFilenameForSave('.csv')))?.getFilenameForSave;

                        if (filename.canceled == false) {
                            filename.name = filename.filePath.replace(/^.*[\\\/]/, '');
                        }

                        let bomFile = await utils.kicad.generateBom(components, [...settings.bom.fields , ...standardField]);

                        await props.dispatch(actions.electron.writeFile(filename.filePath, bomFile));

                    } catch (err) {
                        props.snackbar.error(err.message);
                    }
                    setDisplayLoader(false);
                }}
            />
        </SpeedDial>
    </Box>
}

export default withStoreProvider(withSnackBar(injectIntl(BomPage)));