import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { withSnackBar } from '@remyar/react-snackbar';
import { useStore } from '@remyar/react-store';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import actions from 'actions';

function LibGeneratorPage(props) {
    const intl = useIntl();

    const [url, setUrl] = useState("https://lcsc.com/product-detail/Aluminum-Electrolytic-Capacitors-Leaded_Rubycon-35YXJ470M10x16_C88732.html");
    const [globalState, dispatch] = useStore();

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

                            let PointLib = (await actions.lcsc.getSymbol(_component))?.librarie;

                        } catch (err) {
                            props.snackbar.error(intl.formatMessage({ id: err.message || "Fail.To.Adjust" }), null);
                        } finally {
                            dispatch(actions.application.setApplicationBusy(false));
                        }
                    }} >
                    <Typography variant="subtitle1">{intl.formatMessage({ id: "TransmetteurC120.Button.Adjusting.Start" })}</Typography>
                </Button>
            </Grid>
        </Grid>
    </Box>
}

export default withSnackBar(LibGeneratorPage);