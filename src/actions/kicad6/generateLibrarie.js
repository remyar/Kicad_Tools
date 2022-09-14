import createAction from '../../middleware/actions';
import utils from '../../utils';

export async function generateLibrarie(components, librarieName, { extra, getState }) {

    try {

        let definition = "(kicad_symbol_lib (version 20211014) (generator kicad_symbol_editor)\r\n";

        for (let component of components) {
            definition += await utils.kicad6.getSymbol(component, librarieName);
            definition +="\r\n";
        }

        definition += ")";

        return {
            librarieContent: definition
        };

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(generateLibrarie);