import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { withSnackBar } from '@remyar/react-snackbar';
import { useStore } from '@remyar/react-store';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import actions from 'actions';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
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
    const intl = useIntl();

    const [url, setUrl] = useState("https://lcsc.com/product-detail/Aluminum-Electrolytic-Capacitors-Leaded_Rubycon-35YXJ470M10x16_C88732.html");
    const [globalState, dispatch] = useStore();
    const [components, setComponents] = useState([]);

    return <Box>
        <Grid container direction="row" spacing={1} sx={{ justifyContent: "center" }}>
            <Grid size={8}>
                <TextField id="standard-basic" label="lcsc Url" variant="outlined" placeholder={url} defaultValue={url} sx={{ width: '100%' }} onChange={(event) => {
                    setUrl(event.target.value);
                }} />
            </Grid>
            <Grid size={4}>
                <Button
                    variant="contained"
                    sx={{ width: '100%', height: '100%' }}
                    loading={globalState?.application?.busy}
                    onClick={async () => {
                        try {
                            dispatch(actions.application.setApplicationBusy(true));

                            //-- get symbol and footprint
                            let _component = (await actions.lcsc.getComponent(url.trim()))?.component;

                            let _symbol = (await actions.lcsc.getSymbol(_component))?.symbol;
                            if (_symbol) {
                                _component.hasSymbol = true;
                                _component.symbol = _symbol;
                            }

                            let _footprint = (await actions.lcsc.getFootprint(_component))?.footprint;
                            if (_footprint) {
                                _component.hasFootprint = true;
                                _component.footprint = _footprint;
                            }
                            setComponents([...components, _component])

                        } catch (err) {
                            props.snackbar.error(intl.formatMessage({ id: err.message || "Fail.To.Adjust" }), null);
                        } finally {
                            dispatch(actions.application.setApplicationBusy(false));
                        }
                    }} >
                    <Typography variant="subtitle1">{intl.formatMessage({ id: "TransmetteurC120.Button.Adjusting.Start" })}</Typography>
                </Button>
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
                                <StyledTableCell>{component.isAlreadyLibraire ? component.find(e => (e[0].toString() == "property") && (e[1].toString() == "Manufacturer"))[2].toString() : component.manufacturer}</StyledTableCell>
                                <StyledTableCell>{component.isAlreadyLibraire ? component[1].toString() : component.manufacturerPartNumber}</StyledTableCell>
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
                                                            let picture = (await props.dispatch(actions.lcsc.getImgSymbol(component))).imgSymbol;
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
                                                            let picture = (await props.dispatch(actions.lcsc.getImgFootprint(component))).imgFootprint;
                                                            setModal(<Box dangerouslySetInnerHTML={{ __html: picture, width: "50%" }}></Box>);
                                                        } catch (err) {
                                                            setDisplayLoader(false);
                                                        }
                                                        setDisplayLoader(false);
                                                    }}></MemoryIcon>
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
                    key={'Save6'}
                    icon={<SaveIcon />}
                    tooltipTitle={'Save Kicad 6.x'}
                    onClick={async () => {
                        dispatch(actions.application.setApplicationBusy(true));
                        try {
                            let filename = (await actions.application.getFilenameForSave('.kicad_sym'))?.getFilenameForSave;
                            if (filename.canceled == false) {
                                filename.name = filename.filePath.replace(/^.*[\\\/]/, '');
                                /*let librarie6File = (await props.dispatch(actions.kicad6.generateLibrarie(components, filename.name.replace('.kicad_sym', '')))).librarieContent;
                                await props.dispatch(actions.electron.writeFile(filename.filePath, librarie6File));

                                let footprints = (await props.dispatch(actions.kicad6.generateFootprints(components, filename.name.replace('.kicad_sym', '')))).footprints;
                                for (let footprint of footprints) {
                                    await props.dispatch(actions.electron.writeFile(filename.filePath.replace('.kicad_sym', '.pretty') + path.sep + footprint.name + '.kicad_mod', footprint.footprint));
                                }

                                let models3d = (await props.dispatch(actions.kicad6.generate3DModels(components, filename.name.replace('.kicad_sym', '')))).models3d;
                                for (let model3d of models3d) {
                                    await props.dispatch(actions.electron.writeFile(filename.filePath.replace('.kicad_sym', '.3dshapes') + path.sep + model3d.name + '.wrl', model3d.model3d));
                                }
                                props.snackbar.success(intl.formatMessage({ id: 'lib.save.success' }));*/
                            }

                        } catch (err) {
                            props.snackbar.error(err.message);
                        } finally {
                            dispatch(actions.application.setApplicationBusy(false));
                        }
                   
                    }}
                />
            </SpeedDial>

        </Grid>
    </Box>
}

export default withSnackBar(LibGeneratorPage);