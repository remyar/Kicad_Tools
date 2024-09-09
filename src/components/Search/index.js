import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { injectIntl } from 'react-intl';

function SearchComponent(props){
    const intl = props.intl;
    let timeout = undefined;
    return <TextField label={intl.formatMessage({ id: 'Search' })} variant="outlined" sx={{ width: "100%", textAlign: "center" }} onChange={(event) => {
        if (timeout != undefined) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            props.onChange && props.onChange(event.target.value);
            clearTimeout(timeout);
        }, 1000);
    }}/>
}

export default injectIntl(SearchComponent);