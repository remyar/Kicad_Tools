import createAction from '../../middleware/actions';
import getFootprintFromSvg from '../../utils/kicad5/get.footprint.from.svg';
const SVGJson = require('svg-parser');

function getChildrenWithParam(children, param) {

    if (children.properties && children.properties[param] != undefined) {
        return children;
    } else {
        for (let i = 0; i < children?.children?.length || 0; i++) {
            let c = children.children[i];

            let result = getChildrenWithParam(c, param);
            if (result !== false) {
                return result;
            }
        }

        return false;
    }
}

export async function getFootprint(component, { extra, getState }) {
    let api = extra.api;

    try {
        let Tab = [];

        let respSvgs = await api.get("https://easyeda.com/api/products/" + component.lcscPartNumber + "/svgs");

        if (typeof respSvgs == 'string') {
            respSvgs = JSON.parse(respSvgs)
        }

        if (respSvgs?.success == true) {
            let sch = respSvgs.result.find((x) => x.docType == 2);
            let footprint = respSvgs.result.find((x) => x.docType == 4);
            let svg = SVGJson.parse(sch.svg);
            let _component = getChildrenWithParam(svg.children[0] || [], 'c_para');
            if (footprint) {
                let _indexComponent = "Q";
                let _footprint = getChildrenWithParam(SVGJson.parse(footprint.svg).children[0] || [], 'c_para');
                if (_footprint) {
                    let kicadFootprint = await getFootprintFromSvg(_footprint);
                    Tab = [];

                    if (typeof _footprint.properties.c_para == "string") {
                        let c_param = _component.properties.c_para;
                        let result = c_param.match(/pre`([^`]*)?`/i);

                        _indexComponent = result[1].replace("?", "**");
                    }

                    Tab.push("(module " + component.manufacturerPartnumber + " (layer F.Cu)");
                    Tab.push("(fp_text reference " + _indexComponent + " (at 0 " + (-(footprint.bbox.height / 4) + 1.27) + ") (layer F.SilkS) (effects (font (size 1 1) (thickness 0.15))))");
                    Tab.push("(fp_text value " + component.manufacturerPartnumber + " (at 0 " + ((footprint.bbox.height / 4) - 1.27) + ") (layer F.SilkS) (effects (font (size 1 1) (thickness 0.15))))");
                    Tab.push(...kicadFootprint);
    /*
                    if (component.has3dModel) {
                        Tab.push("(model ./" + librarieName + ".pretty/" + component.manufacturerPartnumber.replace('\\', '_').replace('/', '_') + ".step");
                        Tab.push("(at (xyz 0 0 0))");
                        Tab.push("(scale (xyz 1 1 1))");
                        Tab.push("(rotate (xyz 0 0 0))");
                        Tab.push(")");
                    }*/
                    Tab.push(")");
                }
            }
        }

        return {
            footprint: Tab,
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getFootprint);