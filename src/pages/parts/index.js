import React, { useEffect, useState } from 'react';
import { injectIntl } from 'react-intl';
import { withStoreProvider } from '../../providers/StoreProvider';
import { withNavigation } from '../../providers/navigation';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';

import FormControl from '@mui/material/FormControl';
import SearchComponent from '../../components/Search';

import actions from '../../actions';

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import Loader from '../../components/Loader';


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


function PartsPage(props) {

    const intl = props.intl;
    const categories = [{ sortUuid: 'abc', sortName: "ALL" }, ...props.globalState.categories || []];
    let parts = props.globalState.parts || [];
    const [filter, setFilter] = useState("");
    const [displayLoader, setDisplayLoader] = useState(false);
    const [selectedCategorie, setSelectedCategorie] = useState(categories[0]);
    const [selectedSubCategorie, setSelectedSubCategorie] = useState(undefined);

    const subCategories = [{ sortUuid: 'abc', sortName: "ALL" }, ...selectedCategorie?.childSortList || []];

    async function getAllCategories() {
        try {
            setDisplayLoader(true);
            await props.dispatch(actions.database.getAllCategories());
        } catch (err) {

        } finally {
            setDisplayLoader(false);
        }
    }

    async function getPartsByCategorieId() {
        try {
            setDisplayLoader(true);
            if (selectedSubCategorie != undefined) {
                await props.dispatch(actions.database.getPartsByCategorieId(selectedSubCategorie.componentSortKeyId));
            }
        } catch (err) {

        } finally {
            setDisplayLoader(false);
        }
    }

    async function getPartsWithCategorieIdAndFilter() {
        try {
            setDisplayLoader(true);
            if (selectedSubCategorie != undefined) {
               // await props.dispatch(actions.database.getPartsWithCategorieIdAndFilter(selectedCategorie.componentSortKeyId));
            }
        } catch (err) {

        } finally {
            setDisplayLoader(false);
        }
    }


    useEffect(() => {
        getAllCategories();
    }, []);

    useEffect(() => {
        getPartsByCategorieId();
    }, [selectedSubCategorie]);

    useEffect(() => {
        getPartsWithCategorieIdAndFilter();
    }, [filter]);

    parts = parts.filter(e => e.stockCount > 0);
    
    parts.sort((a, b) => {
        if (a.componentModelEn < b.componentModelEn) return -1;
        if (a.componentModelEn > b.componentModelEn) return 1;
        return 0;
    });

    parts = parts.filter(e => e.componentModelEn.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filter.toLowerCase()))

    return <Box>

        <Loader display={displayLoader} />

        <Grid container spacing={2} sx={{ paddingTop: '25px' }}>
            <Grid item xs={6}>
                <FormControl fullWidth>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedCategorie ? selectedCategorie.sortUuid : 'abc'}
                        onChange={(event) => {
                            setSelectedCategorie(categories.find((c) => c.sortUuid == event.target.value));
                            setSelectedSubCategorie(categories.find((c) => c.sortUuid == event.target.value)?.childSortList[0] || {})
                        }}
                    >
                        {categories.map((_categorie, idx) => {
                            return <MenuItem value={_categorie.sortUuid}>{_categorie.sortName}</MenuItem >
                        })}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6}>
                <FormControl fullWidth>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedSubCategorie ? selectedSubCategorie.sortUuid : 'abc'}
                        onChange={(event) => {
                            setSelectedSubCategorie(subCategories.find((c) => c.sortUuid == event.target.value))
                        }}
                    >
                        {subCategories.map((_categorie, idx) => {
                            return <MenuItem value={_categorie.sortUuid}>{_categorie.sortName}</MenuItem >
                        })}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
        <br />
        <SearchComponent onChange={(value) => {
            setFilter(value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
        }} />
        <br />
        <br />
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <StyledTableCell>Part</StyledTableCell>
                        <StyledTableCell>Description</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        <StyledTableCell>Manufacturer</StyledTableCell>
                        <StyledTableCell>LCSC Part #</StyledTableCell>
                        <StyledTableCell>Stock</StyledTableCell>
                        <StyledTableCell>Price</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {parts.map((part, idx) => {
                        return <StyledTableRow key={'_libraire_component_' + idx}>
                            <StyledTableCell>{part.componentModelEn}</StyledTableCell>
                            <StyledTableCell>{part.describe}</StyledTableCell>
                            <StyledTableCell>{part.componentLibraryType == "expand" ? "Extended Part" : "Basic Part"}</StyledTableCell>
                            <StyledTableCell>{part.componentBrandEn}</StyledTableCell>
                            <StyledTableCell>{part.componentCode}</StyledTableCell>
                            <StyledTableCell>{part.stockCount}</StyledTableCell>
                            <StyledTableCell>{part.componentPrices[0]?.productPrice}</StyledTableCell>
                        </StyledTableRow>
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    </Box>

}

export default withStoreProvider(withNavigation(injectIntl(PartsPage)));