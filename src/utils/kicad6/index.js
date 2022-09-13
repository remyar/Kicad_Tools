import { ExporterSymbolKicad } from "./export_kicad_symbol";

async function getSymbol(component) {
    return new Promise(async (resolve, reject) => {
        try{
            let exporter = new ExporterSymbolKicad(component.symbol);
            let  kicad_symbol_lib = exporter.export(false , )

            console.log(
                "Created Kicad symbol for ID : {component_id}\n",
                "       Symbol name : {easyeda_symbol.info.name}\n",
                "       Library path : {arguments['output']}.{sym_lib_ext}"
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