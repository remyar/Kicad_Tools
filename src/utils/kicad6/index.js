import { ExporterSymbolKicad } from "./export_kicad_symbol";

async function getSymbol(component , librarieName) {
    return new Promise(async (resolve, reject) => {
        try{
            let exporter = new ExporterSymbolKicad(component.symbol);
            let  kicad_symbol_lib = exporter.export(false , librarieName);

            resolve(
                kicad_symbol_lib
            );
        }catch(err){
            reject(err);
        }
    })
}

async function generateLib(component) {
    return new Promise((resolve, reject) => {

    })
}

export default {
    generateLib,
    getSymbol
}