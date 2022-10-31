import createAction from '../../middleware/actions';
import utils from '../../utils';

export async function generate3DModels(components, librarieName, { extra, getState }) {

    try {

        let models3d = [];

        for (let component of components) {

            let model3d = await utils.kicad6.get3DModel(component, librarieName);

            models3d.push({ name: component.footprint.info.name, model3d: model3d });
        }

        return {
            models3d: models3d
        };

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(generate3DModels);