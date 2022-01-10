const SVGJson = require('svg-parser');
import getComponentFromSvg from './get.component.from.svg';
import getFootprintFromSvg from './get.footprint.from.svg';
import ComponentsLibs from './libs/component'


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

            Tab.push('#');
            Tab.push('# ' + component.manufacturerPartnumber);
            Tab.push('#');

            let drawStarted = false;
            let fIndex = 0;
            for (let line of component.symbol) {
                if (drawStarted == false) {
                    if (line.startsWith("F")) {
                        fIndex = parseInt(line.split(' ')[0].replace('F', ''));
                    }

                    if (line.startsWith("F2 ")) {
                        line = line.replace(line.split(' ')[1], '"' + librarieName + ':' + component.manufacturerPartnumber.replace('/', '_').replace('\\', '_') + '"');
                    }
                }

                if (line.startsWith("DRAW")) {
                    fIndex++;
                    Tab.push('F' + fIndex + ' "' + component.lcscPartNumber + '" 3050 -700 50 H I L CNN "LCSC Part Number"');
                    fIndex++;
                    Tab.push('F' + fIndex + ' "' + component.package + '" 3050 -700 50 V I C CNN "Package"');
                    drawStarted = true;
                }
                Tab.push(line)
            }
            Tab.push('#');

            let str = Tab.join("\n");
            return str;
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

async function getFootprint(component, librarieName) {
    try {
        if (component.footprintData) {
            return component.footprintData;
        } else {

            let Tab = [];
            for (let line of component.footprint) {
                if (line.startsWith("(model ")) {
                    line = line.replace("(model ", "(model ./" + librarieName + ".pretty/");
                }
                Tab.push(line);
            }
            let str = Tab.join("\n");
            return str;
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

async function parseKicadNetlist(str) {
    try {
        let netlistParsed = await ComponentsLibs.LoadComponentFromNET(str);
        let res = await ComponentsLibs.ExtractAndSortComponents(netlistParsed);
        let components = await ComponentsLibs.ApplaySort(res);
        return components;
    } catch (err) {
        throw Error(err)
    }
}

async function generateBom(components, fields) {
    function generateHeader() {
        let header = [];

        fields.map((f) => {
            if (f.display == true) {
                header.push(f.name);
            }
        });

        return header.join(';');
    }
    try {
        let lines = [];
        lines.push(generateHeader());

        components?.UniquePartList?.map((component, row) => {
            let line = [];
            let refs = [];

            component.Ref.forEach(element => {
                refs.push(component.RefPrefix + element);
            });

            line.push((component.Fields.find((f) => f.name == "Description")?.value || "").replace(/,/g, ''));

            line.push(component.RefPrefix);
            line.push(refs.join(' '));
            line.push(component.Value);
            line.push(component.Footprint);
            line.push(component.Count);
            line.push(component.Status || "");
            line.push(component.Datasheet || "");
            line.push(component.Fields.find((f) => f.name == "LCSC Part Number")?.value || "");
            line.push(component.PartNumber || "");
            lines.push(line.join(';'));
        });
        return lines.join('\r\n');
    } catch (err) {
        throw Error(err)
    }
}

export default {
    getSymbol,
    getFootprint,
    generateLib,
    generateBom,
    parseKicadLib,
    parseKicadNetlist
}