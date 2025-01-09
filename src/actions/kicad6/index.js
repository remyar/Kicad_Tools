import utils from '../../utils';

export default {
    generateLibrarie: async (components, librarieName) => {
        try {
            let definition = "(kicad_symbol_lib (version 20211014) (generator kicad_symbol_editor)\r\n";

            for (let component of components) {

                if (component?.isAlreadyLibraire && (component?.isAlreadyLibraire == true)) {
                    definition += await utils.sexp.getSymbol(component, librarieName);
                } else {
                    definition += await utils.kicad6.getSymbol(component, librarieName);

                }
                definition += "\r\n";
            }

            definition += ")";

            return {
                librarieContent: definition
            };
        } catch (err) {
            throw { message: err.message };
        }
    },
    generateFootprints: async (components, librarieName) => {
        try {

            let footprints = [];

            for (let component of components) {

                if (component?.isAlreadyLibraire && (component?.isAlreadyLibraire == true)) {

                } else {
                    let footprint = await utils.kicad6.getFootprint(component, librarieName);
                    footprints.push({ name: component.footprint.info.name, footprint: footprint });
                }
            }

            return {
                footprints: footprints
            };

        } catch (err) {
            throw { message: err.message };
        }
    },
    generate3DModels: async (components, librarieName = "") => {
        try {

            let models3d = [];

            for (let component of components) {

                if (component?.isAlreadyLibraire && (component?.isAlreadyLibraire == true)) {

                } else {
                    let model3d = await utils.kicad6.get3DModel(component, librarieName);
                    models3d.push({ name: component.footprint.model_3d.name, model3d: model3d });
                }
            }

            return {
                models3d: models3d
            };

        } catch (err) {
            throw { message: err.message };
        }
    },
    generate3DModel: async (component) => {
        try {
            let model3d = "";
            if (component?.isAlreadyLibraire && (component?.isAlreadyLibraire == true)) {

            } else {
                model3d = await utils.kicad6.get3DModel(component, "");
            }

            return {
                model3d: model3d
            };

        } catch (err) {
            throw { message: err.message };
        }
    }
}