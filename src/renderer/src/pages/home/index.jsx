import { useIntl } from 'react-intl';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router";
import Typography from '@mui/material/Typography';
import { useStore } from '@remyar/react-store';

import Routes from 'routes';

function HomePage(props) {

    const intl = useIntl();

    const navigation = useNavigate();
    const [globalState, dispatch] = useStore();

    return <Box>
        <Box sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: "80%",
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
        }}>
            <Grid container direction="row" spacing={1} sx={{ justifyContent: "center" }}>
                <Grid size={3}>
                    <Button variant="contained" sx={{ width: '100%' }} onClick={() => { navigation(Routes.urlLibGenerator()) }}>{intl.formatMessage({ id: 'nav.generate.librarie' })}</Button>
                </Grid>
            </Grid>
            <Grid container direction="row" spacing={1} sx={{ justifyContent: "center", paddingTop: "10px" }}>
                <Grid size={3}>
                    <Button variant="contained" sx={{ width: '100%' }} onClick={() => { navigation(Routes.urlBom()) }}>{intl.formatMessage({ id: 'nav.generate.bom' })}</Button>
                </Grid>
            </Grid>
            <Grid container direction="row" spacing={1} sx={{ justifyContent: "center", paddingTop: "10px" }}>
                <Grid size={3}>
                    <Button variant="contained" sx={{ width: '100%' }} onClick={() => { navigation(Routes.urlPos()) }}>{intl.formatMessage({ id: 'nav.generate.pos' })}</Button>
                </Grid>
            </Grid>

        </Box >
    </Box >
}

export default HomePage;