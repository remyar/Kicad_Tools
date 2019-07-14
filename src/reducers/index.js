import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import KicadBom from './kicad_bom';
import ExportBom from './export_bom';

export default (history) => combineReducers({
    router: connectRouter(history),
    KicadBom,
    ExportBom,
});