import { CallToActionSharp } from "@mui/icons-material";
import { ExporterSymbolKicad } from "./export_kicad_symbol";
import { ExporterFootprintKicad } from "./export_kicad_footprint";
import { Exporter3dModelKicad } from "./export_kicad_3d_model";

async function getSymbol(component, librarieName) {
    return new Promise(async (resolve, reject) => {
        try {
            let exporter = new ExporterSymbolKicad(component.symbol);
            let kicad_symbol_lib = exporter.export(false, librarieName);

            resolve(
                kicad_symbol_lib
            );
        } catch (err) {
            reject(err);
        }
    })
}

async function getFootprint(component, librarieName) {
    return new Promise((resolve, reject) => {
        try {
            let exporter = new ExporterFootprintKicad(component.footprint);
            let kicad_footprint_lib = exporter.export(false, librarieName);

            resolve(
                kicad_footprint_lib
            );
        } catch (err) {
            reject(err);
        }
    });
}

async function get3DModel(component , librarieName ){
    return new Promise(async (resolve, reject) => {
        try {
            let exporter = new Exporter3dModelKicad(component.model3D);
            let kicad_3d_model = exporter.export();
            resolve(kicad_3d_model);
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