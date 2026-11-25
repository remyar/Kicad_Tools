import { EasyedaSymbolImporter, EasyedaFootprintImporter, Easyeda3dModelImporter } from "./easyeda_importer";

export default {
    GetSymbol: async (cad_data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let importer = new EasyedaSymbolImporter(cad_data);
                resolve(importer.get_symbol());
            } catch (err) {
                reject(err);
            }
        });
    },
    GetFootprint: async (cad_data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let importer = new EasyedaFootprintImporter(cad_data);
                resolve(importer.get_footprint());
            } catch (err) {
                reject(err);
            }
        });
    }
}