const is = require('is-js');
const R = require('ramda');
const Parse = require('s-expression');
const { XMLParser } = require('fast-xml-parser');

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
                            TempFieldHolder.push(value);
                            /*  for (let key in value) {
                                  TempFieldHolder[value[key]] = value[key];
                              }*/

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

    return new Promise((resolve, reject) => {
        try {
            let obj = undefined;

            const options = {
                ignoreAttributes: false,
                attributeNamePrefix : "",
                textNodeName: "value"
            };

            const parser = new XMLParser(options);
            obj = parser.parse(kicadNetlist);

            if (!is.array(obj.export.components.comp)) {
                obj.export.components.comp = [obj.export.components.comp];
            }

            for (let Part of obj.export.components.comp) {
                if (Part.fields) {
                    for (let f of Part.fields.field) {
                        if (f.unquote) {
                            f.value += ',' + f.unquote;
                            delete f.unquote;
                        }
                    }
                }
                if (Part.value) {
                    if (is.array(Part.value)) {
                        Part.value = Part.value[0];
                    }
                    if (Part.value.unquote) {
                        Part.value.value += ',' + Part.value.unquote;
                        delete Part.value.unquote;
                    }

                    if ( Part.value.value){
                        Part.value = Part.value.value;
                    }

                }
                if (Part.footprint) {
                    if (Part.footprint.unquote) {
                        Part.footprint.value += ',' + Part.footprint.unquote;
                        delete Part.footprint.unquote;
                        Part.footprint = Part.footprint.value;
                    }
                }
                if (Part.libsource && Part.libsource.part) {
                    if (Part.libsource.part.unquote) {
                        Part.libsource.part.value += ',' + Part.libsource.part.unquote;
                        delete Part.libsource.part.unquote;
                        Part.libsource.part = Part.libsource.part.value;
                    }
                }
            }


            resolve(obj);
        } catch (err) {
            return reject(err);
        }
    });

}


export default {
    LoadComponentFromNET,
    ExtractAndSortComponents,
    ApplaySort
}