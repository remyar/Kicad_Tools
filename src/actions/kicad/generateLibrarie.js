import createAction from '../../middleware/actions';
import utils from '../../utils';

export async function generateLibrarie(components , librarieName , { extra, getState }) {

    try {

        let symbols = [];

        for ( let component of components){
            let definition = await utils.kicad.getSymbol(component , librarieName);
            symbols.push(definition);
        }

        let response = await utils.kicad.generateLib(symbols);

        return {
            librarieContent : response
        };

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(generateLibrarie);