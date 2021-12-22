const is = require('is-js');
const R = require('ramda');
const Parse = require('s-expression');

async function LoadComponentFromNET(config , kicadNetlist) {

    var arrayPaths = [
        'export.components.comp',
        'export.libparts.libpart',
        'export.libparts.libpart.pins',
        'export.libparts.libpart.pins.pin',
        'export.libparts.libpart.fields',
        'export.libparts.libpart.fields.field',
        'export.libraries.library',
        'export.nets.net',
        'export.nets.net.node'
    ];

    function objectify(input) {
        if (is.string(input)) {
            return input;
        }

        var key = input.shift();

        var output = {};
        output[key] = input.length === 1 ? input[0] : input.map(objectify);
        return output;
    }

    function stringify(input) {
        if (is.array(input) || is.string(input)) {
            return input;
        }
        var output = '';
        for (var i = 0; i in input; i++) {
            output += input[i];
        }
        return output.length > 0 ? output : input;
    }

    function unnestify(input, path) {

        function getNewPath(key) {
            return path + (path ? '.' : '') + key;
        }

        var key;
        input = stringify(input);
        var output = {};

        if (is.string(input)) {
            output = input;
        } else if (is.array(input)) {
            input.forEach(function (obj) {
                if (is.string(obj)) {
                    if (!output.$) {
                        output.$ = [];
                    }
                    output.$.push(obj);
                    return;
                }

                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        var objVal = unnestify(obj[key], getNewPath(key));
                        if (!(key in output)) {
                            output[key] = [objVal];
                        } else {
                            output[key].push(objVal);
                        }
                    }
                }
            });

            for (key in output) {
                if (output.hasOwnProperty(key)) {
                    if (!R.contains(getNewPath(key), arrayPaths)) {
                        var array = output[key];
                        if (array.length === 1) {
                            output[key] = array[0];
                        }
                    }
                }
            }
        } else {  // object
            for (key in input) {
                if (input.hasOwnProperty(key)) {
                    output[key] = unnestify(input[key], getNewPath(key));
                }
            }
        }

        return output;
    }

    return new Promise(function (resolve, reject) {

        try {
            //let kicadNetlist = NETFile.readFileSync(Path.resolve(config.input.path), 'utf8');
            let object = unnestify(objectify(Parse(kicadNetlist)));

            object.export.$ = { version: object.export.version };
            object.export.design = [object.export.design];
            object.export.design[0].sheet = [object.export.design[0].sheet];
            object.export.design[0].sheet[0].title_block = [object.export.design[0].sheet[0].title_block];
            object.export.design[0].sheet[0].title_block[0].comment.forEach((x) => {
                x.$ = {
                    value: x.value.toString()
                }
                delete x.value;
            })
            delete object.export.version;

            object.export.components = [object.export.components];
            object.export.components[0].comp.forEach((Part) => {
                
                Part.$ = {
                    ref: Part.ref
                }
                delete Part.ref;

                Part.footprint = [Part.footprint];
                Part.value = [Part.value.replace(',' , ':')];
                Part.datasheet = [Part.datasheet];

                if (Part.fields) {
                    Part.fields = [Part.fields];
                    Part.fields.forEach(value => {
                        if ( value.field == undefined ){
                            value.field = [{
                                $ : value.$[1],
                                name : value[1]
                            }];
                        }
                        if (value.field && value.field.length) {
                            value.field.forEach((value) => {
                                value['_'] = value.$.replace(',' , ':');
                                value.$ = {
                                    name: value.name.toString(),
                                };
                            });
                        }
                    });
                }
            });

            Components.inputData = object;
            Components.inputType = 'NET';
            Components.version = Components.inputData.export.$.version;

            if (Components.version !== KiCadXMLRevision) {
                return reject('Incompatible KiCad XML version: Expected ' + KiCadXMLRevision + ' Found ' + Components.version)
            }

            // extract page information
            Components.created = Components.inputData.export.design[0].date.toString();
            Components.title = Components.inputData.export.design[0].sheet[0].title_block[0].title.toString();
            Components.date = Components.inputData.export.design[0].sheet[0].title_block[0].date.toString();
            Components.company = Components.inputData.export.design[0].sheet[0].title_block[0].company.toString();
            Components.revision = Components.inputData.export.design[0].sheet[0].title_block[0].rev.toString();
            Components.comment = [
                Components.inputData.export.design[0].sheet[0].title_block[0].comment[0].$.value,
                Components.inputData.export.design[0].sheet[0].title_block[0].comment[1].$.value,
                Components.inputData.export.design[0].sheet[0].title_block[0].comment[2].$.value,
                Components.inputData.export.design[0].sheet[0].title_block[0].comment[3].$.value,
            ];
            return resolve(Components);
        } catch (err) {
            return reject(err);
        }
    });
}


export default {
    LoadComponentFromNET
}