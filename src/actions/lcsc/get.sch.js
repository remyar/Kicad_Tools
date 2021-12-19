import createAction from '../../middleware/actions';

export async function getComponent({ extra , getState }) {

    let api = extra.api;

    try {
      
        return {
            sets: expansions
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getComponent);