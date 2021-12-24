import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';

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
import TableCell from '@mui/material/TableCell';

function BomPage(props) {
    const [displayLoader, setDisplayLoader] = useState(false);
    const [components, setComponents] = useState([]);

    let fields = [];

    return <Box>
        <Loader display={displayLoader} />

        <TableContainer component={Paper}>
            <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Ref</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Footprint</TableCell>
                        {components?.UniquePartList?.map((component) => {
                            let res = [];
                            for (let field in component?.Fields) {
                                if (fields.find((el) => el == field) == undefined) {
                                    res.push(<TableCell>{field}</TableCell>);
                                    fields.push(field);
                                }
                            }
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
                        cells.push(<TableCell>{refs.join(', ')}</TableCell>);
                        cells.push(<TableCell>{component.Count}</TableCell>);
                        cells.push(<TableCell>{component.Value}</TableCell>);
                        cells.push(<TableCell>{component.Footprint}</TableCell>);
                        fields.map((field) => {
                            cells.push(<TableCell>{component?.Fields && component?.Fields[field] || ""}</TableCell>);
                        })
                        return <TableRow>{cells}</TableRow>;
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
                        let file = (await props.dispatch(actions.electron.getFilenameForOpen('.net')))?.getFilenameForOpen?.data;
                        if (file.canceled == false) {
                            let fileData = (await props.dispatch(actions.electron.readFile(file.filePaths[0])))?.fileData;
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
                        let filename = (await props.dispatch(actions.electron.getFilenameForSave('.csv')))?.getFilenameForSave?.data;

                        if (filename.canceled == false) {
                            filename.name = filename.filePath.replace(/^.*[\\\/]/, '');
                        }

                        let bomFile = await utils.kicad.generateBom(components);

                        await props.dispatch(actions.electron.writeFile(filename.filePath, bomFile));

                    } catch( err ){
                        props.snackbar.error(err.message);
                    }
                    setDisplayLoader(false);
                }}
            />
        </SpeedDial>
    </Box>
}

export default withStoreProvider(withSnackBar(injectIntl(BomPage)));