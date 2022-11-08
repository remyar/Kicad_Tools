import createAction from '../../middleware/actions';
import utils from '../../utils';

export async function generate3DModel(component, { extra, getState }) {

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

export default createAction(generate3DModel);