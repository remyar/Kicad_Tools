import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';

import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import Loader from '../../components/Loader';

import Box from '@mui/material/Box';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import FileOpenIcon from '@mui/icons-material/FileOpen';
import actions from '../../actions';

import utils from '../../utils';

function BomPage(props) {
    const [displayLoader, setDisplayLoader] = useState(false);

    return <Box>
        <Loader display={displayLoader} />

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
                        let file = (await props.dispatch(actions.electron.getFilenameForOpen('.net')))?.getFilenameForOpen?.data;
                        if ( file.canceled == false ){
                            let fileData = (await props.dispatch(actions.electron.readFile(file.filePaths[0])))?.fileData;
                            await utils.kicad.parseKicadNetlist(fileData);
                        }
                    } catch (err) {
                        props.snackbar.error(err.message);
                    }
                    setDisplayLoader(false);
                }}>
            </SpeedDialAction>
        </SpeedDial>
    </Box>
}

export default withStoreProvider(withSnackBar(injectIntl(BomPage)));