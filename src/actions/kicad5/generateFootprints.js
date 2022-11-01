import createAction from '../../middleware/actions';
import utils from '../../utils';

export async function generateFootprints(components, librarieName, { extra, getState }) {

    try {

        let footprints = [];

        for (let component of components) {
            let footprint = await utils.kicad5.getFootprint(component, librarieName);
            let model3D = undefined;
            if (component.model3D && component.model3D.length > 0 && typeof component.model3D == "string") {
                model3D = component.model3D;
            } else if ( component.model3D && component.model3D.wrl){
                model3D = component.model3D.wrl;
            }
            footprints.push({ name: component.manufacturerPartnumber, footprint: footprint , model3D });

        }

        return {
            footprints: footprints
        };

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(generateFootprints);