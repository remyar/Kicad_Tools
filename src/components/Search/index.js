import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { injectIntl } from 'react-intl';

function SearchComponent(props){
    const intl = props.intl;
    const [field, setField] = useState("");

    useEffect(() => {
        props.onChange && props.onChange(field);
    }, [field]);

    return <TextField label={intl.formatMessage({ id: 'Search' })} variant="outlined" sx={{ width: "100%", textAlign: "center" }} onChange={(event) => {
        setField(event.target.value);
    }}/>
}

export default injectIntl(SearchComponent);