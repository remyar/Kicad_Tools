import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';

import { withSnackBar } from '@remyar/react-snackbar'
import Grid from '@mui/material/Grid2';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Loader from '../../components/Loader';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import SettingsInputSvideoIcon from '@mui/icons-material/SettingsInputSvideo';
import MemoryIcon from '@mui/icons-material/Memory';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SaveIcon from '@mui/icons-material/Save';
import FileOpenIcon from '@mui/icons-material/FileOpen';

import path from 'path';
import actions from '../../actions';
import utils from '../../utils';

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

    const [displayLoader, setDisplayLoader] = useState(false);
    const [url, setUrl] = useState("https://lcsc.com/product-detail/Aluminum-Electrolytic-Capacitors-Leaded_Rubycon-35YXJ470M10x16_C88732.html");

    const [components, setComponents] = useState([]);

    const [_SVGModal, setSVGModal] = useState();
    const [_3DModal, set3DModal] = useState();
    const [modal, setModal] = useState();

    return <Box>
        <Loader display={displayLoader} />

        {/*modal && <Modal display={modal ? true : false} onClose={() => { setModal(undefined) }}>{modal}</Modal>*/}
        {/*_SVGModal && <ModalSVG display={_SVGModal ? true : false} onClose={() => { setSVGModal(undefined); }} component={_SVGModal} />*/}
        {/*_3DModal && <Modal3D display={_3DModal ? true : false} onClose={() => { set3DModal(undefined); }} models3d={_3DModal?.models3D} component={_3DModal}></Modal3D>*/}

        <Grid container spacing={2}>
            <Grid size={8}>
                <TextField id="standard-basic" label="lcsc Url" variant="outlined" placeholder={url} defaultValue={"https://lcsc.com/product-detail/Aluminum-Electrolytic-Capacitors-Leaded_Rubycon-35YXJ470M10x16_C88732.html"} sx={{ width: '100%' }} onChange={(event) => {
                    setUrl(event.target.value);
                }} />
            </Grid>
            <Grid size={4}>
                <Button variant="contained" sx={{ width: '100%', height: '100%' }} onClick={async () => {
                    setDisplayLoader(true);
                    try {
                        //-- get symbol and footprint
                        let _component = (await actions.lcsc.getComponent(url.trim()))?.component;

                        let PointLib = (await actions.lcsc.getSymbol(_component))?.librarie;
                        if (PointLib) {
                            _component.hasSymbol = true;
                            _component.symbol = PointLib;
                        }

                        let PointKicadMod = (await actions.lcsc.getFootprint(_component))?.footprint;
                        if (PointKicadMod) {
                            _component.hasFootprint = true;
                            _component.footprint = PointKicadMod;
                        }

                        await actions.lcsc.get3DModel(_component);
                        if (_component?.footprint?.model_3d?.raw_obj && _component.footprint.model_3d.raw_obj != '') {
                            _component.has3dModel = true;
                            _component.model3D = _component.footprint.model_3d.raw_obj;
                            _component.wrl = (await actions.kicad6.generate3DModel(_component)).model3d
                        }

                        setComponents([...components, _component]);
                    } catch (err) {
                        props.snackbar.error(err.message);
                    } finally {
                        setDisplayLoader(false);
                    }
                }}> {intl.formatMessage({ id: 'lib.gen.addToLib' })}</Button>
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
                            <StyledTableCell>{component.isAlreadyLibraire ? component.find(e => (e[0].toString() == "property") && (e[1].toString() == "Manufacturer"))[2]?.toString() : component.manufacturer}</StyledTableCell>
                            <StyledTableCell>{component.isAlreadyLibraire ? component[1].toString() : component.manufacturerPartnumber}</StyledTableCell>
                            <StyledTableCell>{component.isAlreadyLibraire ? component.find((e) => e[0] == "property" && (e[1] && e[1].toString() == "Footprint"))[2].split(":")[1].toString() : component?.footprint?.info?.name ? component?.footprint?.info?.name : component.package}</StyledTableCell>
                            <StyledTableCell>{component.isAlreadyLibraire ? component.find((e) => e[0] == "property" && (e[1] && e[1].toString() == "Description"))[2].toString() : component.description}</StyledTableCell>
                            <StyledTableCell>{component.isAlreadyLibraire ? component.find(e => (e[0].toString() == "property") && (e[1].toString().includes("LCSC Part")))[2].toString() : component.lcscPartNumber}</StyledTableCell>
                            <StyledTableCell>
                                <Grid container spacing={2}>
                                    <Grid size={3}>
                                        <Tooltip title="Symbol">
                                            <SettingsInputSvideoIcon sx={{
                                                color: component.hasSymbol ? "" : "LightGray",
                                                cursor: component.hasSymbol ? "pointer" : "default"
                                            }}
                                                onClick={async () => {
                                                    setDisplayLoader(true);
                                                    try {
                                                        if (component.isAlreadyLibraire) {
                                                            component.lcscPartNumber = component.find(e => (e[0].toString() == "property") && (e[1].toString() == "LCSC Part"))[2]?.toString();
                                                        }
                                                        let picture = (await actions.lcsc.getImgSymbol(component))?.imgSymbol;
                                                        setSVGModal(picture);
                                                    } catch (err) {
                                                        setDisplayLoader(false);
                                                    }
                                                    setDisplayLoader(false);
                                                }
                                                }></SettingsInputSvideoIcon>
                                        </Tooltip>
                                    </Grid>
                                    <Grid size={3}>
                                        <Tooltip title="Footprint">
                                            <MemoryIcon sx={{
                                                color: component.hasFootprint ? "" : "LightGray",
                                                cursor: component.hasFootprint ? "pointer" : "default"
                                            }}
                                                onClick={async () => {
                                                    setDisplayLoader(true);
                                                    try {
                                                        if (component.isAlreadyLibraire) {
                                                            component.lcscPartNumber = component.find(e => (e[0].toString() == "property") && (e[1].toString() == "LCSC Part"))[2]?.toString();
                                                        }
                                                        let picture = (await actions.lcsc.getImgFootprint(component)).imgFootprint;
                                                        setModal(<Box dangerouslySetInnerHTML={{ __html: picture, width: "50%" }}></Box>);
                                                    } catch (err) {
                                                        setDisplayLoader(false);
                                                    }
                                                    setDisplayLoader(false);
                                                }}>

                                            </MemoryIcon>
                                        </Tooltip>
                                    </Grid>
                                    <Grid size={3}>
                                        <Tooltip title="3D">
                                            <ThreeDRotationIcon
                                                sx={{
                                                    color: component.has3dModel ? "" : "LightGray",
                                                    cursor: component.has3dModel ? "pointer" : "default"
                                                }}
                                                onClick={async () => {
                                                    set3DModal(component);
                                                }}
                                            ></ThreeDRotationIcon>
                                        </Tooltip>
                                    </Grid>
                                    <Grid size={3}>
                                        <Tooltip title="Datasheet">
                                            <PictureAsPdfOutlinedIcon
                                                sx={{
                                                    color: component.isAlreadyLibraire ? (
                                                        (component.find((e) => e[0] == "property" && (e[1] && e[1]?.toString() == "Datasheet")) || [0, 0, undefined])[2]?.split(":")[1]?.toString() ? "" : "LightGray") : (component.datasheet ? "" : "LightGray")
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
                        let file = (await actions.electron.getFilenameForOpen('.kicad_sym'))?.getFilenameForOpen;
                        if (file.canceled == false) {

                            let fileData = (await actions.electron.readFile(file.filePath)).fileData;
                            let _c = await utils.kicad6.parseKicadLib(fileData);

                            let footprintsPath = file.filePath.replace('.kicad_sym', '.pretty');
                            let ___c = [...components];
                            for (let __c of _c) {
                                __c.hasSymbol = false;
                                __c.isAlreadyLibraire = true;
                                let __f = __c.find((e) => e[0] == "property" && (e[1] && e[1].toString() == "Footprint"));
                                __c.hasFootprint = false;
                                __c.has3dModel = false;
                                if (__f) {
                                    __c.hasSymbol = true;
                                    let footprint = __f[2].toString().split(':')[1];
                                    let footprintData = (await actions.electron.readFile(footprintsPath + '/' + footprint + '.kicad_mod')).fileData
                                    if (footprintData) {
                                        __c.hasFootprint = true;
                                        __c.footprintData = footprintData;
                                        if (footprintData.includes('model')) {
                                            __c.has3dModel = true;
                                        }
                                    }
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
                        let filename = (await actions.electron.getFilenameForSave('.kicad_sym'))?.getFilenameForSave;
                        if (filename.canceled == false) {
                              filename.name = filename.filePath.replace(/^.*[\\\/]/, '');

                              let librarie6File = (await actions.kicad6.generateLibrarie(components, filename.name.replace('.kicad_sym', ''))).librarieContent;
                              await actions.electron.writeFile(filename.filePath, librarie6File);
  
                              let footprints = (await actions.kicad6.generateFootprints(components, filename.name.replace('.kicad_sym', ''))).footprints;
                              for (let footprint of footprints) {
                                  await actions.electron.writeFile(filename.filePath.replace('.kicad_sym', '.pretty') + path.sep + footprint.name + '.kicad_mod', footprint.footprint);
                              }
    
                              let models3d = (await actions.kicad6.generate3DModels(components, filename.name.replace('.kicad_sym', ''))).models3d;
                              for (let model3d of models3d) {
                                  await actions.electron.writeFile(filename.filePath.replace('.kicad_sym', '.3dshapes') + path.sep + model3d.name + '.wrl', model3d.model3d);
                              }

                              props.snackbar.success(intl.formatMessage({ id: 'lib.save.success' }));
                        }

                    } catch (err) {
                        props.snackbar.error(err.message);
                    } finally {
                        setDisplayLoader(false);
                    }
                }}
            />
        </SpeedDial>
    </Box>
}

export default withSnackBar(injectIntl(LibGeneratorPage));