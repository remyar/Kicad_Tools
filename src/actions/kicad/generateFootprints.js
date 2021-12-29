import createAction from '../../middleware/actions';
import utils from '../../utils';

export async function generateFootprints(components, librarieName, { extra, getState }) {

    try {

        let footprints = [];

        for (let component of components) {
            let footprint = await utils.kicad.getFootprint(component, librarieName);
            let model3D = undefined;
            if ( component.has3dModel){
                model3D = component.model3D;
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