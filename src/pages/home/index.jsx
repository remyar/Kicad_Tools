
import { injectIntl } from 'react-intl';
import { useNavigation } from '@remyar/react-navigation';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import routeMdw from '../../routes';

function HomePage(props) {
    const intl = props.intl;
    const navigation = useNavigation();

    return <Box sx={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
    }}>
        <Box >
            <Button variant="contained" sx={{ width: '100%' }} onClick={() => { navigation.push(routeMdw.urlLibGenerator()) }}>{intl.formatMessage({ id: 'nav.generate.librarie' })}</Button>
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
            <Button variant="contained" sx={{ width: '100%' }} onClick={() => { navigation.push(routeMdw.urlBom()) }}>{intl.formatMessage({ id: 'nav.generate.bom' })}</Button>
        </Box>
        <Box sx={{ paddingTop: "10px" }}>
            <Button variant="contained" sx={{ width: '100%' }} onClick={() => { navigation.push(routeMdw.urlPos()) }}>{intl.formatMessage({ id: 'nav.generate.pos' })}</Button>
        </Box>
    </Box>
}

export default injectIntl(HomePage);