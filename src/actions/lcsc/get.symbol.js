import createAction from '../../middleware/actions';
import getComponentFromSvg from '../../utils/kicad5/get.component.from.svg';
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

export async function getSymbol(component, { extra, getState }) {

    let api = extra.api;

    try {

        let symbol = undefined;

        let respSvgs = await api.get("https://easyeda.com/api/products/" + component.lcscPartNumber + "/svgs");

        if (typeof respSvgs == 'string') {
            respSvgs = JSON.parse(respSvgs)
        }

        if (respSvgs?.success == true) {
            let _symbol = respSvgs.result.find((r) => r.docType == 2);
            if (_symbol && _symbol.svg) {
                let svg = SVGJson.parse(_symbol.svg);
                let _indexComponent = "Q";
                let kicadComponent = [];
                let _component = getChildrenWithParam(svg.children[0] || [], 'c_para');
                if (_component) {
                    kicadComponent = await getComponentFromSvg(_component);
                    let bomSp = "";
                    let Tab = [];

                    if (typeof _component.properties.c_para == "string") {
                        let c_param = _component.properties.c_para;
                        let result = c_param.match(/pre`([^`]*)?`/i);

                        _indexComponent = result[1].replace("?", "");

                        bomSp = c_param.match(/BOM_Supplier Part`([^`]*)?`/i)[1];

                    }

                    let y = parseFloat(_component.properties.c_origin.split(',')[1]) + 100;

                    Tab.push('#');
                    Tab.push('# ' + component.manufacturerPartnumber);
                    Tab.push('#');

                    Tab.push('DEF ' + component.manufacturerPartnumber + ' ' + _indexComponent + ' 0 5 Y Y 1 F N');
                    Tab.push('F0 "' + _indexComponent + '" 0 ' + y + ' 50 H V C CNN');
                    Tab.push('F1 "' + component.manufacturerPartnumber + '" 0 -' + y + ' 50 H V C CNN');
                    Tab.push('F2 "' + component.manufacturerPartnumber.replace('/', '_').replace('\\', '_') + '" 0 100 50 V I C CNN');
                    Tab.push('F3 "' + component.datasheet + '" 0 100 50 V I C CNN');
                    Tab.push('F4 "' + bomSp + '" 0 100 50 V I C CNN "LCSC Part Number"');
                    Tab.push('F5 "' + component.manufacturer + '" 0 100 50 V I C CNN "Manufacturer"');
                    Tab.push('F6 "' + component.package + '" 0 100 50 V I C CNN "Package"');
                    Tab.push('F7 "' + component.description + '" 0 100 50 V I C CNN "Description"');
                    Tab.push('DRAW');
                    Tab.push(...kicadComponent);
                    Tab.push('ENDDRAW');
                    Tab.push('ENDDEF');
                  
                    Tab.push('#');
                    symbol = Tab;
                }
            }
        }

        return {
            librarie: symbol,
        }
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getSymbol);