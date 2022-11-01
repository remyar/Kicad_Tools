import createAction from '../../middleware/actions';
import utils from '../../utils';

export async function generateFootprints(components, librarieName, { extra, getState }) {

    try {

        let footprints = [];

        for (let component of components) {

            let footprint = await utils.kicad6.getFootprint(component, librarieName);

            footprints.push({ name: component.footprint.info.name, footprint: footprint });
        }

        return {
            footprints: footprints
        };

    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(generateFootprints);