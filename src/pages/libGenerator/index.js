import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';

import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import Loader from '../../components/Loader';

import Modal from '../../components/Modal';

import actions from '../../actions';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import Tooltip from '@mui/material/Tooltip';

import SaveIcon from '@mui/icons-material/Save';
import MemoryIcon from '@mui/icons-material/Memory';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import SettingsInputSvideoIcon from '@mui/icons-material/SettingsInputSvideo';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import FileOpenIcon from '@mui/icons-material/FileOpen';
import utils from '../../utils';

function LibGeneratorPage(props) {

    const intl = props.intl;
    const [url, setUrl] = useState("");
    const [components, setComponents] = useState([]);
    const [displayLoader, setDisplayLoader] = useState(false);
    const [modal, setModal] = useState();

    return <Box>

        <Loader display={displayLoader} />

        <Modal display={modal ? true : false} onClose={() => { setModal(undefined) }}>
            {modal}
        </Modal>

        <Grid container spacing={2}>
            <Grid item xs={8}>
                <TextField id="standard-basic" label="lcsc Url" variant="outlined" placeholder={url} defaultValue={"https://lcsc.com/product-detail/MICROCHIP_Microchip-Tech-PIC18F4550-I-P_C648001.html"} sx={{ width: '100%' }} onChange={(event) => {
                    setUrl(event.target.value);
                }} />
            </Grid>
            <Grid item xs={4}>
                <Button variant="contained" sx={{ width: '100%', height: '100%' }} onClick={async () => {
                    setDisplayLoader(true);
                    try {
                        let _component = (await props.dispatch(actions.lcsc.getComponent(url))).component;
                        let _c = [...components];
                        _c.push(_component);
                        setComponents(_c);
                    } catch (err) {
                        props.snackbar.error(err.message);
                    }
                    setDisplayLoader(false);
                }}>{intl.formatMessage({ id: 'lib.gen.addToLib' })}</Button>
            </Grid>
        </Grid>
        <br />
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Manufacturer</TableCell>
                        <TableCell>Mfr. Part #</TableCell>
                        <TableCell>Package</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>LCSC Part #</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {components.map((component, idx) => {
                        return <TableRow key={'_libraire_component_' + idx}>
                            <TableCell>{component.manufacturer}</TableCell>
                            <TableCell>{component.manufacturerPartnumber}</TableCell>
                            <TableCell>{component.package}</TableCell>
                            <TableCell>{component.description}</TableCell>
                            <TableCell>{component.lcscPartNumber}</TableCell>
                            <TableCell>
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <Tooltip title="Symbol">
                                            <SettingsInputSvideoIcon sx={{
                                                color: component.hasSymbol ? "" : "LightGray",
                                                cursor: component.hasSymbol ? "pointer" : "default"
                                            }}
                                                onClick={() => { setModal(<Box dangerouslySetInnerHTML={{ __html: component.svgs.find((x) => x.docType == 2).svg }}></Box>) }}></SettingsInputSvideoIcon>
                                        </Tooltip>

                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip title="Footprint">
                                            <MemoryIcon sx={{
                                                color: component.hasFootprint ? "" : "LightGray",
                                                cursor: component.hasFootprint ? "pointer" : "default"
                                            }}
                                                onClick={() => { setModal(<Box dangerouslySetInnerHTML={{ __html: component.svgs.find((x) => x.docType == 4).svg }}></Box>) }}></MemoryIcon>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip title="3D">
                                            <ThreeDRotationIcon sx={{ color: component.Package3D ? "" : "LightGray" }}></ThreeDRotationIcon>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip title="Datasheet">
                                            <PictureAsPdfOutlinedIcon
                                                sx={{
                                                    color: component.datasheet ? "" : "LightGray"
                                                }}
                                                onClick={() => {
                                                    setModal(<Box>

                                                    </Box>)
                                                }}
                                            ></PictureAsPdfOutlinedIcon>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </TableCell>
                            <TableCell>
                                <DeleteForeverIcon sx={{ color: 'red', cursor: 'pointer' }} onClick={() => {
                                    let _c = [];
                                    components.forEach((_comp, _idx) => {
                                        if (idx != _idx) {
                                            _c.push(_comp);
                                        }
                                    });
                                    setComponents(_c);
                                }} />
                            </TableCell>
                        </TableRow>
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
                        let fileData = (await props.dispatch(actions.electron.readFile())).fileData;
                        await utils.kicad.parseKicadLib(fileData);
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
                        let filename = (await props.dispatch(actions.electron.getFilenameForSave())).getFilenameForSave;
                        if (filename.canceled == false) {
                            filename.name = filename.filePath.replace(/^.*[\\\/]/, '');
                        }

                        let librarieFile = (await props.dispatch(actions.kicad.generateLibrarie(components, filename.name.replace('.lib', '')))).librarieContent;
                        let footprints = (await props.dispatch(actions.kicad.generateFootprints(components, filename.name.replace('.lib', '')))).footprints;

                        await props.dispatch(actions.electron.writeFile(filename.filePath, librarieFile));
                        for (let footprint of footprints) {
                            await props.dispatch(actions.electron.writeFile(filename.filePath.replace(filename.name, '') + '/' + filename.name.replace('.lib', '.pretty') + '/' + footprint.name.replace('\\', '_').replace('/', '_') + ".kicad_mod", footprint.footprint));
                        }

                        props.snackbar.success(intl.formatMessage({ id: 'lib.save.success' }));
                    } catch (err) {
                        props.snackbar.error(err.message);
                    }
                    setDisplayLoader(false);
                }}
            />
        </SpeedDial>
    </Box >
}

export default withStoreProvider(withSnackBar(injectIntl(LibGeneratorPage)));