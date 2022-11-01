import { EasyedaSymbolImporter, EasyedaFootprintImporter , Easyeda3dModelImporter } from "./easyeda_importer";

async function getSymbol(cad_data, librarieName) {
    return new Promise(async (resolve, reject) => {
        try {
            let importer = new EasyedaSymbolImporter(cad_data);
            resolve(importer.get_symbol());
        } catch (err) {
            reject(err);
        }
    });
}

async function getFootprint(cad_data, librarieName) {
    return new Promise(async (resolve, reject) => {
        try {
            let importer = new EasyedaFootprintImporter(cad_data);
            resolve(importer.get_footprint());
        } catch (err) {
            reject(err);
        }
    });
}

async function get3DModel(cad_data , librarieName ){
    return new Promise(async (resolve, reject) => {
        try {
            resolve(cad_data);
           // resolve(importer.get_footprint());
        } catch (err) {
            reject(err);
        }
    });
}

export default {
    getSymbol,
    getFootprint,
    get3DModel
}