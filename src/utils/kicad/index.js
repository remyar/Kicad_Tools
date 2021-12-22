const SVGJson = require('svg-parser');
import getComponentFromSvg from './get.component.from.svg';
import getFootprintFromSvg from './get.footprint.from.svg';
import ComponentsLibs from './libs/component'

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

async function getSymbol(component, librarieName) {
    try {

        if (component.file) {
            let Tab = [];
            Tab.push('#');
            Tab.push('# ' + component.manufacturerPartnumber);
            Tab.push('#');

            for (let line of component.file) {
                if (line.startsWith('F2 ')) {
                    let oldLibName = line.replace('F2 "', '').split(':')[0];
                    line = line.replace(oldLibName, librarieName);
                }
                Tab.push(line);
            }

            Tab.push('#');
            let str = Tab.join("\n");
            return str;
        } else {

            let Tab = [];
            let _indexComponent = "Q";

            let sch = component.svgs.find((x) => x.docType == 2);
            let kicadComponent = [];

            let svg = SVGJson.parse(sch.svg);
            let _component = getChildrenWithParam(svg.children[0] || [], 'c_para');

            if (_component) {
                kicadComponent = await getComponentFromSvg(_component);
                let bomSp = "";
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
                Tab.push('F2 "' + librarieName + ':' + component.manufacturerPartnumber.replace('/', '_').replace('\\', '_') + '" 0 100 50 V I C CNN');
                Tab.push('F3 "' + component.datasheet + '" 0 100 50 V I C CNN');
                Tab.push('F4 "' + bomSp + '" 0 100 50 V I C CNN "LCSC"');
                Tab.push('F5 "' + component.manufacturer + '" 0 100 50 V I C CNN "Manufacturer"');
                Tab.push('F6 "' + component.package + '" 0 100 50 V I C CNN "Package"');
                Tab.push('F7 "' + component.description + '" 0 100 50 V I C CNN "Description"');
                Tab.push('DRAW');
                Tab.push(...kicadComponent);
                Tab.push('ENDDRAW');
                Tab.push('ENDDEF');
                Tab.push('#');

                let str = Tab.join("\n");
                return str;
            }
        }
    } catch (err) {
        throw Error(err)
    }
}

async function generateLib(symbols) {
    return new Promise((resolve, reject) => {
        let str = "EESchema-LIBRARY Version 2.3\r\n";
        str += "#encoding utf-8\r\n";

        symbols.forEach(element => {
            str += element
        });

        str += '\r\n#End Library';
        resolve(str);
    })
}

async function getFootprint(component) {
    try {
        if (component.footprintData) {
            return component.footprintData;
        } else {

            let Tab = [];
            let sch = component.svgs.find((x) => x.docType == 2);
            let footprint = component.svgs.find((x) => x.docType == 4);
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
                    Tab.push(")");

                    let str = Tab.join("\n");
                    return str;
                }
            }
        }
    } catch (err) {
        throw Error(err)
    }

}


async function parseKicadLib(str) {
    try {
        return new Promise((resolve, reject) => {

            let myLibrarieComponent = [];
            let _definition = {};

            str.split('\n').map((_line) => {

                _line = _line.replace('\r', '');

                if (_line.startsWith("DEF ")) {
                    _definition = { file: [] };
                }

                if (_definition.file) {
                    _definition.file.push(_line);
                }
                if (_line.startsWith("F0 ")) {
                    _definition.ref = _line.match(/\"([^\\"]|\\")*\"/gm)[0].replace(/\"/gm, "");
                }

                if (_line.startsWith("F1 ")) {
                    _definition.manufacturerPartnumber = _line.match(/\"([^\\"]|\\")*\"/gm)[0].replace(/\"/gm, "");
                }

                if (_line.startsWith("F2 ")) {
                    _definition.footprint = _line.match(/\"([^\\"]|\\")*\"/gm)[0].replace(/\"/gm, "");
                    _definition.hasFootprint = true;
                }
                if (_line.startsWith("F3 ")) {
                    _definition.datasheet = _line.match(/\"([^\\"]|\\")*\"/gm)[0].replace(/\"/gm, "");
                }

                if (_line.startsWith("F4 ")) {
                    _definition.lcscPartNumber = _line.match(/\"([^\\"]|\\")*\"/gm)[0].replace(/\"/gm, "");
                }

                if (_line.startsWith("F5 ")) {
                    _definition.manufacturer = _line.match(/\"([^\\"]|\\")*\"/gm)[0].replace(/\"/gm, "");
                }

                if (_line.startsWith("F6 ")) {
                    _definition.package = _line.match(/\"([^\\"]|\\")*\"/gm)[0].replace(/\"/gm, "");
                }

                if (_line.startsWith("F7 ")) {
                    _definition.description = _line.match(/\"([^\\"]|\\")*\"/gm)[0].replace(/\"/gm, "");
                }

                if (_line.startsWith('ENDDRAW')) {
                    _definition.hasSymbol = true;
                }

                if (_line.startsWith("ENDDEF")) {
                    myLibrarieComponent.push(_definition);
                    _definition = {};
                }

            });
            resolve(myLibrarieComponent);
        })
    } catch (err) {
        throw Error(err)
    }
}

async function parseKicadNetlist(str){
    try{
        await ComponentsLibs.LoadComponentFromNET({},str)
    }catch(err){
        throw Error(err)
    }
}

export default {
    getSymbol,
    getFootprint,
    generateLib,
    parseKicadLib,
    parseKicadNetlist
}