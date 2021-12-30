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

function PosPage(props) {
    const [displayLoader, setDisplayLoader] = useState(false);
    const [csvFile, setCsvFile] = useState("");

    let _headers = [];
    let _content = [];

    csvFile.split('\n').forEach((line, idx) => {
        line = line.replace('\r', '');
        let _line = [];
        line.length > 0 && line.split(',').forEach((word) => {
            if (idx == 0) {
                _headers.push(word);
            } else {
                _line.push(word.replace(/"/g,''));
            }
        });
        if (_line.length > 0) {
            _content.push(_line);
        }
    })

    return <Box>
        <Loader display={displayLoader} />

        <TableContainer component={Paper}>
            <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {_headers.map((header, _idx) => {
                            return <StyledTableCell key={"PosFileLine" + _idx}>{header}</StyledTableCell>
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {_content.map((lines, idx) => {
                        return <StyledTableRow key={"posFile" + idx}>
                            {lines.map((word, _idx) => {
                                return <StyledTableCell key={"PosFileLine" + _idx}>{word}</StyledTableCell>
                            })
                            }
                        </StyledTableRow>
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
                        let file = (await props.dispatch(actions.electron.getFilenameForOpen('.csv')))?.getFilenameForOpen;
                        if (file.canceled == false) {
                            let fileData = (await props.dispatch(actions.electron.readFile(file.filePath)))?.fileData;
                            setCsvFile(fileData);
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

                        //-- csvFile
                        let posFile = [];
                        csvFile.split('\n').forEach((line, idx) => {
                            line = line.replace('\r', '');
                            posFile.push(line);
                        });

                        if (posFile.length > 0) {
                            posFile[0] = posFile[0].replace('Ref' , 'Designator').replace('PosX' , 'Mid X').replace('PosY' , 'Mid Y').replace('Rot' , 'Rotation').replace('Side' , 'Layer');
                        }
                        await props.dispatch(actions.electron.writeFile(filename.filePath, posFile.join('\r\n')));

                    } catch (err) {
                        props.snackbar.error(err.message);
                    }
                    setDisplayLoader(false);
                }}
            />
        </SpeedDial>
    </Box>
}

export default withStoreProvider(withSnackBar(injectIntl(PosPage)));