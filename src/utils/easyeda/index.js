import EasyedaSymbolImporter from "./easyeda_importer";

async function getSymbol(cad_data, librarieName) {
    return new Promise(async (resolve, reject) => {
        try{
            let importer = new EasyedaSymbolImporter(cad_data);
            resolve(importer.get_symbol());
        }catch(err){
            reject(err);
        }
    });
}

export default {
    getSymbol
}