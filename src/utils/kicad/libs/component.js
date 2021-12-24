const is = require('is-js');
const R = require('ramda');
const Parse = require('s-expression');

async function ApplaySort(Components) {

    let config = {
        sort: { by: 'ref', ascending: true }
    };

    return new Promise((resolve, reject) => {

        Components.sortMeta.fields.sort()
        Components.sortMeta.groups.sort()
        Components.sortMeta.groupedList = null

        for (var groupedIndex in Components.GroupedList) {

            // will need to first sort any sub data of each component. this include ref
            for (var PartIndex in Components.GroupedList[groupedIndex]) {

                Components.GroupedList[groupedIndex][PartIndex].Ref.sort(function (refA, refB) {
                    if (config.sort.by === 'ref' && !config.sort.ascending) {
                        return refB - refA
                    }
                    return refA - refB
                })
            }
            // sort the sub groups
            Components.GroupedList[groupedIndex].sort(function (partA, partB) {
                var IsNumber = true
                var CompareA = 0
                var CompareB = 0

                switch (config.sort.by) {
                    case 'ref':
                        CompareA = partA.Ref[0]
                        CompareB = partB.Ref[0]
                        break
                    case 'qty':
                        CompareA = partA.Count
                        CompareB = partB.Count
                        break
                    case 'value':
                        IsNumber = false
                    //< fallthrough
                    case 'value_num':
                        CompareA = partA.Value
                        CompareB = partB.Value
                        break
                    case 'footprint':
                        IsNumber = false
                        CompareA = partA.Footprint
                        CompareB = partB.Footprint
                        break
                    case 'datasheet':
                        IsNumber = false
                        CompareA = partA.Datasheet
                        CompareB = partB.Datasheet
                        break
                    default:
                        return 0 // leave unsorted
                }

                if (IsNumber) {
                    if (config.sort.ascending) {
                        return CompareA - CompareB
                    }
                    return CompareB - CompareA
                } else {
                    // sort string
                    CompareA = CompareA.toUpperCase()
                    CompareB = CompareB.toUpperCase()
                    if (CompareA < CompareB) {
                        return config.sort.ascending ? -1 : 1
                    } else if (CompareA > CompareB) {
                        return config.sort.ascending ? 1 : -1
                    } else {
                        return 0
                    }
                }

            })
        }

        resolve(Components);
    });
}


function SearchUniquePartIndex(source, searchTerm, listOfGroups) {

    for (var Index = 0; Index < source.length; Index++) {
        // reset the filed test flag. this will ensure that we check the next part that might have all the matching fields
        var FieldsTestResult = true
        // part value matches
        if (searchTerm.Value === source[Index].Value && searchTerm.Footprint === source[Index].Footprint && searchTerm.Datasheet === source[Index].Datasheet) {
            for (var FieldIndex = 0; FieldIndex < listOfGroups.length; FieldIndex++) {
                // If either one is true
                if (listOfGroups[FieldIndex] in searchTerm.Fields || listOfGroups[FieldIndex] in source[Index].Fields) {
                    // If either one is true then both have to be set
                    if (listOfGroups[FieldIndex] in searchTerm.Fields &&
                        listOfGroups[FieldIndex] in source[Index].Fields &&
                        searchTerm.Fields[listOfGroups[FieldIndex]] === source[Index].Fields[listOfGroups[FieldIndex]]) {
                        // Do nothing
                    } else {
                        FieldsTestResult = false
                    }
                }
            }

            // We have a match
            if (FieldsTestResult) {
                return Index
            }
        }
    }

    return -1
}

async function ExtractAndSortComponents(inputData) {

    return new Promise((resolve, reject) => {

        let Components = {
            inputData: null,
            inputType: null,
            version: null, // this is the input BOM data structure version
            NumberOfUniqueParts: 0,
            TotalNumberOfParts: 0,
            GroupedList: null,
            UniquePartList: null,
            sortMeta: {
                fields: null,
                groups: null,
            }, // holds a set of arrays that are used to sort the BOM
            created: "",
            tile: "",
            date: "",
            company: "",
            revison: "",
            comment: null
        }

        try {

            Components.UniquePartList = [];
            let PartIndex = 0
            Components.GroupedList = [];
            Components.sortMeta.groups = [];       // holds the list of groups. This is used to make sorting easier
            Components.sortMeta.fields = [];
            Components.NumberOfUniqueParts = 0;
            Components.TotalNumberOfParts = 0;

            inputData.export.components.comp.forEach(function (Part) {

                let TempFieldHolder = [];

                if (Part.fields) {
                    if (Part.fields?.field?.length) {
                        Part.fields.field.forEach(function (value) {
                            for (let key in value) {
                                TempFieldHolder[key] = value[key];
                            }

                        });
                    }
                }

                let FootprintValue = '';

                // get the component footprint if its not been defined or left empty
                if (typeof Part.footprint !== 'undefined' && typeof Part.footprint !== 'undefined') {
                    FootprintValue = Part.footprint;
                }

                let DatasheetValue = '';

                // get the component footprint if its not been defined or left empty
                if (typeof Part.datasheet !== 'undefined' && typeof Part.datasheet !== 'undefined') {
                    DatasheetValue = Part.datasheet;
                }


                let TempPart = {
                    Value: Part.value,
                    Count: 1,
                    Ref: [],
                    Fields: TempFieldHolder,
                    Datasheet: DatasheetValue,
                    Footprint: FootprintValue,
                    RefPrefix: Part.ref.replace(/[0-9]/g, '')
                }

                PartIndex = SearchUniquePartIndex(Components.UniquePartList, TempPart, Components.sortMeta.fields);

                // Do we have this part?
                if (PartIndex === -1) {
                    Components.UniquePartList.push(TempPart)
                    PartIndex = Components.UniquePartList.length
                    PartIndex--

                    Components.UniquePartList[PartIndex].Ref.push(parseInt(Part.ref.replace(/[a-zA-Z]/g, '')))

                    if (Part.fields) {
                        Part.fields.field.forEach(function (value) {

                            if (Components.sortMeta.fields.filter((el) => JSON.stringify(el) == JSON.stringify(value)).length == 0) {
                                Components.sortMeta.fields.push(value)
                            }

                        });

                    }

                    if (!Components.GroupedList[Components.UniquePartList[PartIndex].RefPrefix]) {
                        // array doesn't exist so create a dummy array
                        Components.sortMeta.groups.push(Components.UniquePartList[PartIndex].RefPrefix)
                        Components.GroupedList[Components.UniquePartList[PartIndex].RefPrefix] = []
                    }

                    Components.GroupedList[Components.UniquePartList[PartIndex].RefPrefix].push(Components.UniquePartList[PartIndex])

                    Components.NumberOfUniqueParts++
                } else {
                    Components.UniquePartList[PartIndex].Count++
                    Components.UniquePartList[PartIndex].Ref.push(parseInt(Part.ref.replace(/[a-zA-Z]/g, '')))
                }

                Components.TotalNumberOfParts++
            });

            resolve(Components);
        } catch (err) {
            reject(err);
        }
    });
}

async function LoadComponentFromNET(kicadNetlist) {

    function objectify(input) {
        if (is.string(input)) {
            return input;
        }

        var key = input.shift();

        var output = {};
        output[key] = input.length === 1 ? input[0] : input.map(objectify);
        return output;
    }

    function flatObj(input) {
        let output = {};
        if (is.string(input)) {
            output = input.toString();
        } else if (is.array(input)) {
            input.forEach((i) => {
                for (let key in i) {
                    if (i.hasOwnProperty(key)) {
                        let objVal = flatObj(i[key]);
                        if (!(key in output)) {
                            output[key] = objVal;
                        } else {
                            if (is.array(output[key]) == false) {
                                output[key] = [output[key]];
                            }
                            output[key].push(objVal);
                        }
                    }
                }
            });
        } else if (is.object(input)) {
            for (let key in input) {
                if (input.hasOwnProperty(key)) {
                    output[key] = flatObj(input[key]);
                }
            }
        }
        return output;
    }

    return new Promise((resolve, reject) => {
        try {
            let netlistParsed = Parse(kicadNetlist);
            let obj = flatObj(objectify(netlistParsed));
            obj.export.components.comp.forEach((Part, _idx) => {
                if (Part.fields) {
                    Part.fields.field.forEach((f, idx) => {
                        let __f = {};
                        if (f.name != undefined) {
                            __f.name = f.name;
                            __f.value = "";
                            delete f.name;
                            for (let _i in f) {
                                __f.value += f[_i];
                            }
                            obj.export.components.comp[_idx].fields.field[idx] = {};
                            obj.export.components.comp[_idx].fields.field[idx][__f.name] = __f.value;
                        }
                    });
                }
            });

            resolve(obj);
        } catch (err) {
            return reject(err);
        }
    });
    /*
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
        });*/
}


export default {
    LoadComponentFromNET,
    ExtractAndSortComponents,
    ApplaySort
}