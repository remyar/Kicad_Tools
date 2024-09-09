import createAction from '../../middleware/actions';
import easyeda from '../../utils/easyeda';

export async function get3DModel(component, { extra, getState }) {
    let api = extra.api;
    try {
        if (component.footprint.model_3d.uuid != undefined) {

            component.footprint.model_3d.raw_obj = await api.get("https://easyeda.com/analyzer/api/3dmodel/" + component.footprint.model_3d.uuid);;
            component.footprint.model_3d.step = await api.get("https://modules.easyeda.com/qAxj6KHrDKw4blvCG8QJPs7Y/" + component.footprint.model_3d.uuid);;

            if (component.footprint.model_3d.raw_obj != undefined) {
                let _res = await easyeda.get3DModel(component.footprint.model_3d.raw_obj);
                return {
                    model3d: _res,
                }
            } else {
                throw { message: "Symbol not found" }
            }

        } else {
            return {
                model3d : undefined,
            }
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(get3DModel);