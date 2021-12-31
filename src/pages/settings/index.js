import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';

import { withStoreProvider } from '../../providers/StoreProvider';
import { withSnackBar } from '../../providers/snackBar';

import Box from '@mui/material/Box';

function SettingsPage(props){
    return <Box>
        settings page
    </Box>
}

export default withStoreProvider(withSnackBar(injectIntl(SettingsPage)));