import React from 'react';
import { injectIntl } from 'react-intl';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

function LibGeneratorPage(props) {

    const intl = props.intl;

    return <Box>
        <Grid container spacing={2}>
            <Grid item xs={8}>
                <TextField id="standard-basic" label="lcsc Url" variant="outlined" placeholder={"teer"} sx={{width:'100%'}}/>
            </Grid>
            <Grid item xs={4}>
                <Button variant="contained" sx={{width:'100%' , height : '100%' }} onClick={()=>{}}>{intl.formatMessage({ id: 'lib.gen.addToLib' })}</Button>
            </Grid>
        </Grid>
    </Box>
}

export default injectIntl(LibGeneratorPage)