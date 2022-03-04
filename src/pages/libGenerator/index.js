import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';

import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import Loader from '../../components/Loader';

import Modal from '../../components/Modal';
import Modal3D from '../../components/3DModal';

import actions from '../../actions';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { styled } from '@mui/material/styles';

import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';

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

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { __ } from 'ramda';

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

function LibGeneratorPage(props) {

    const intl = props.intl;
    const [url, setUrl] = useState("");
    const [components, setComponents] = useState([]);
    const [displayLoader, setDisplayLoader] = useState(false);
    const [modal, setModal] = useState();
    const [_3DModal, set3DModal] = useState();

    return <Box>

        <Loader display={displayLoader} />

        <Modal display={modal ? true : false} onClose={() => { setModal(undefined) }}>
            {modal}
        </Modal>

        <Modal3D display={_3DModal ? true : false} onClose={(model3D) => { 
            _component.model3D = model3D;
            set3DModal(undefined);
        }} models3d={_3DModal}>
        </Modal3D>


        <Grid container spacing={2}>
            <Grid item xs={8}>
                <TextField id="standard-basic" label="lcsc Url" variant="outlined" placeholder={url} defaultValue={"https://lcsc.com/product-detail/Aluminum-Electrolytic-Capacitors-Leaded_Rubycon-35YXJ470M10x16_C88732.html"} sx={{ width: '100%' }} onChange={(event) => {
                    setUrl(event.target.value);
                }} />
            </Grid>
            <Grid item xs={4}>
                <Button variant="contained" sx={{ width: '100%', height: '100%' }} onClick={async () => {
                    setDisplayLoader(true);
                    try {
                        //-- get symbol and footprint
                        let _component = (await props.dispatch(actions.lcsc.getComponent(url.trim())))?.component;

                        let PointLib = (await props.dispatch(actions.samacsys.getLibrarie(_component.manufacturerPartnumber, _component.package)))?.librarie;
                        if (PointLib) {
                            _component.hasSymbol = true;
                            _component.symbol = PointLib;
                        } else {
                            PointLib = (await props.dispatch(actions.lcsc.getSymbol(_component)))?.librarie;
                            if (PointLib) {
                                _component.hasSymbol = true;
                                _component.symbol = PointLib;
                            }
                        }

                        //let PointKicadMod = (await props.dispatch(actions.samacsys.getFootprint(_component.manufacturerPartnumber, _component.package)))?.footprint;
                        let PointKicadMod = (await props.dispatch(actions.lcsc.getFootprint(_component)))?.footprint;
                        if (PointKicadMod) {
                            _component.hasFootprint = true;
                            _component.footprint = PointKicadMod;
                        }/* else {
                            PointKicadMod = (await props.dispatch(actions.lcsc.getFootprint(_component)))?.footprint;
                            if (PointKicadMod) {
                                _component.hasFootprint = true;
                                _component.footprint = PointKicadMod;
                            }
                        }*/

                        let models3D = (await props.dispatch(actions.lcsc.get3DModel(_component.manufacturerPartnumber, _component.package))).models3d;
                        /*   let model3D = (await props.dispatch(actions.samacsys.get3DModel(_component.manufacturerPartnumber, _component.package))).model3d;
                        */
                        if (models3D) {
                            _component.has3dModel = true;
                            _component.model3D = models3D[0];
                            _component.models3D = models3D;
                        }

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
                        <StyledTableCell>Manufacturer</StyledTableCell>
                        <StyledTableCell>Mfr. Part #</StyledTableCell>
                        <StyledTableCell>Package</StyledTableCell>
                        <StyledTableCell>Description</StyledTableCell>
                        <StyledTableCell>LCSC Part #</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {components.map((component, idx) => {
                        return <StyledTableRow key={'_libraire_component_' + idx}>
                            <StyledTableCell>{component.manufacturer}</StyledTableCell>
                            <StyledTableCell>{component.manufacturerPartnumber}</StyledTableCell>
                            <StyledTableCell>{component.package}</StyledTableCell>
                            <StyledTableCell>{component.description}</StyledTableCell>
                            <StyledTableCell>{component.lcscPartNumber}</StyledTableCell>
                            <StyledTableCell>
                                <Grid container spacing={2}>
                                    <Grid item xs={3}>
                                        <Tooltip title="Symbol">
                                            <SettingsInputSvideoIcon sx={{
                                                color: component.hasSymbol ? "" : "LightGray",
                                                cursor: component.hasSymbol ? "pointer" : "default"
                                            }}
                                                onClick={async () => {
                                                    setDisplayLoader(true);
                                                    let picture = (await props.dispatch(actions.samacsys.getImgSymbol(component.manufacturerPartnumber, component.package)))?.imgSymbol;
                                                    if (picture) {
                                                        setModal(<Box > <img alt="Embedded Image" src={"data:image/png;base64," + picture} /> </Box>);
                                                    } else {
                                                        picture = (await props.dispatch(actions.lcsc.getImgSymbol(component))).imgSymbol;
                                                        setModal(<Box dangerouslySetInnerHTML={{ __html: picture }}></Box>);
                                                    }
                                                    setDisplayLoader(false);
                                                }
                                                }></SettingsInputSvideoIcon>
                                        </Tooltip>

                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip title="Footprint">
                                            <MemoryIcon sx={{
                                                color: component.hasFootprint ? "" : "LightGray",
                                                cursor: component.hasFootprint ? "pointer" : "default"
                                            }}
                                                onClick={async () => {
                                                    setDisplayLoader(true);
                                                    let picture = (await props.dispatch(actions.samacsys.getImgFootprint(component.manufacturerPartnumber, component.package)))?.imgFootprint;
                                                    if (picture) {
                                                        setModal(<Box > <img alt="Embedded Image" src={"data:image/png;base64," + picture} /> </Box>);
                                                    } else {
                                                        picture = (await props.dispatch(actions.lcsc.getImgFootprint(component))).imgFootprint;
                                                        setModal(<Box dangerouslySetInnerHTML={{ __html: picture }}></Box>);
                                                    }
                                                    setDisplayLoader(false);
                                                }}></MemoryIcon>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Tooltip title="3D">
                                            <ThreeDRotationIcon
                                                sx={{
                                                    color: component.has3dModel ? "" : "LightGray",
                                                    cursor: component.hasFootprint ? "pointer" : "default"
                                                }}
                                                onClick={async () => {
                                                    set3DModal(component.models3D);
                                                }}
                                            ></ThreeDRotationIcon>
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
                            </StyledTableCell>
                            <StyledTableCell>
                                <DeleteForeverIcon sx={{ color: 'red', cursor: 'pointer' }} onClick={() => {
                                    let _c = [];
                                    components.forEach((_comp, _idx) => {
                                        if (idx != _idx) {
                                            _c.push(_comp);
                                        }
                                    });
                                    setComponents(_c);
                                }} />
                            </StyledTableCell>
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
                        let file = (await props.dispatch(actions.electron.getFilenameForOpen('.lib')))?.getFilenameForOpen;
                        if (file.canceled == false) {

                            let fileData = (await props.dispatch(actions.electron.readFile(file.filePath))).fileData;
                            let _c = await utils.kicad5.parseKicadLib(fileData);
                            let footprintsPath = file.filePath.replace('.lib', '.pretty');
                            let ___c = [...components];
                            for (let __c of _c) {
                                let footprintData = (await props.dispatch(actions.electron.readFile(footprintsPath + '/' + __c.footprint.split(':')[1] + '.kicad_mod'))).fileData
                                if (footprintData) {
                                    __c.footprintData = footprintData;
                                    if (footprintData.includes('model')) {
                                        __c.has3dModel = true;
                                    }
                                } else {
                                    __.hasFootprint = false;
                                }
                                ___c.push(__c);
                            }
                            setComponents(___c);
                        }
                    } catch (err) {
                        props.snackbar.error(err.message);
                    }
                    setDisplayLoader(false);
                }}>
            </SpeedDialAction>

            <SpeedDialAction
                key={'Save6'}
                icon={<SaveIcon />}
                tooltipTitle={'Save Kicad 6.x'}
                onClick={async () => {
                    setDisplayLoader(true);
                    try {
                        let filename = (await props.dispatch(actions.electron.getFilenameForSave('.kicad_sym')))?.getFilenameForSave;
                        if (filename.canceled == false) {
                            filename.name = filename.filePath.replace(/^.*[\\\/]/, '');
                            let librarie5File = (await props.dispatch(actions.kicad5.generateLibrarie(components, filename.name.replace('.kicad_sym', '')))).librarieContent;
                            let librarie6File = (await props.dispatch(actions.kicad6.convertFormKicad5Librarie(librarie5File))).librarieContent;
                            let footprints = (await props.dispatch(actions.kicad5.generateFootprints(components, filename.name.replace('.kicad_sym', '')))).footprints;

                            await props.dispatch(actions.electron.writeFile(filename.filePath, librarie6File));
                            for (let footprint of footprints) {
                                await props.dispatch(actions.electron.writeFile(filename.filePath.replace(filename.name, '') + '/' + filename.name.replace('.kicad_sym', '.pretty') + '/' + footprint.name.replace('\\', '_').replace('/', '_') + ".kicad_mod", footprint.footprint));
                                if (footprint.model3D && footprint.model3D.length > 0) {
                                    await props.dispatch(actions.electron.writeFile(filename.filePath.replace(filename.name, '') + '/' + filename.name.replace('.kicad_sym', '.pretty') + '/' + footprint.name.replace('\\', '_').replace('/', '_') + ".stp", footprint.model3D));
                                }
                            }

                            props.snackbar.success(intl.formatMessage({ id: 'lib.save.success' }));
                        }

                    } catch (err) {
                        props.snackbar.error(err.message);
                    }
                    setDisplayLoader(false);
                }}
            />

            <SpeedDialAction
                key={'Save5'}
                icon={<SaveIcon />}
                tooltipTitle={'Save kicad 5.x'}
                onClick={async () => {
                    setDisplayLoader(true);
                    try {
                        let filename = (await props.dispatch(actions.electron.getFilenameForSave('.lib')))?.getFilenameForSave;
                        if (filename.canceled == false) {
                            filename.name = filename.filePath.replace(/^.*[\\\/]/, '');

                            let librarieFile = (await props.dispatch(actions.kicad5.generateLibrarie(components, filename.name.replace('.lib', '')))).librarieContent;
                            let footprints = (await props.dispatch(actions.kicad5.generateFootprints(components, filename.name.replace('.lib', '')))).footprints;

                            await props.dispatch(actions.electron.writeFile(filename.filePath, librarieFile));
                            for (let footprint of footprints) {
                                await props.dispatch(actions.electron.writeFile(filename.filePath.replace(filename.name, '') + '/' + filename.name.replace('.lib', '.pretty') + '/' + footprint.name.replace('\\', '_').replace('/', '_') + ".kicad_mod", footprint.footprint));
                                if (footprint.model3D && footprint.model3D.length > 0) {
                                    await props.dispatch(actions.electron.writeFile(filename.filePath.replace(filename.name, '') + '/' + filename.name.replace('.lib', '.pretty') + '/' + footprint.name.replace('\\', '_').replace('/', '_') + ".stp", footprint.model3D));
                                }
                            }

                            props.snackbar.success(intl.formatMessage({ id: 'lib.save.success' }));
                        }
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