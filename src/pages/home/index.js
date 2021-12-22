import React from 'react';
import { injectIntl } from 'react-intl';
import { withNavigation } from '../../providers/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import routeMdw from '../../middleware/route';

function HomePage(props) {

    const intl = props.intl;

    return <Box sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
    }}>
        <Box>
            <Button variant="contained" sx={{ width: '100%' }} onClick={() => { props.navigation.push(routeMdw.urlBom()) }}>{intl.formatMessage({ id: 'nav.generate.bom' })}</Button>
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
            <Button variant="contained" sx={{ width: '100%' }} onClick={() => { props.navigation.push(routeMdw.urlLibGenerator()) }}>{intl.formatMessage({ id: 'nav.generate.librarie' })}</Button>
        </Box>
       {/* <Box sx={{ paddingTop: "10px" }}>
            <Button variant="contained" sx={{ width: '100%' }} onClick={() => { }}>{intl.formatMessage({ id: 'nav.convert.eagle2kicad' })}</Button>
    </Box>*/}
    </Box>

}

export default withNavigation(injectIntl(HomePage));