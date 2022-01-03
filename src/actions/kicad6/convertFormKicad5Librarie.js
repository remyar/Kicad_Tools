import createAction from '../../middleware/actions';
import utils from '../../utils';

export async function convertFormKicad5Librarie(librarie5File, { extra, getState }) {

    try {
        let response = undefined;

        response = await utils.kicad6.convertFromkicad5Librarie(librarie5File);
    
        return {
            librarieContent : response
        };

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(convertFormKicad5Librarie);