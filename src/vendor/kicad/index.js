import readFile from '../file';
import xml2js from 'xml2js';
import price from './price';
import Vue from 'vue';

let parser = new xml2js.Parser();

let fileList = {
    project : "",
    schematics : [],
    components : [],
    bom : {},
    board : ""
};


function _getTypeWithRef(ref){
    let type = undefined;
    let refs =[
        { start : "R", ref : "R" },
        { start : "C", ref : "C" },
        { start : "D", ref : "D" },
        { start : "U", ref : "U" },
        { start : "IC", ref : "U" },
        { start : "Q", ref : "Q" },
        { start : "T", ref : "Q" },
        { start : "J", ref : "J" },
        { start : "P", ref : "J" },
    ];

    if ( ref != undefined )
    {
        refs.map((r)=> {

            if ( ref.startsWith(r.start) ) {
                type = Vue.i18n.translate('bom.' + r.ref );
            }
            
        })
    }
    return type;
}

const openProFile = ( proFile ) => {

    let schList = [];
    return readFile.read(proFile.replace('.pro' , ".sch")).then((fileContent) => {

        if (  check(fileContent) == true )
            return fileContent;
        else
            throw new Error(Vue.i18n.translate('msg.error.notKicadProject'));

    }).then((fileContent) => {

        let list = [];
        fileContent.match( /\$Sheet([\s\S]*?)\$EndSheet/gi).map((content) => {

            let lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\t/g, '\n').trim().split("\n");
            lines.map((line) => {
                if ( line.includes('.sch') )
                {
                    //-- include a .sch
                    line = line.replace(/"/g, '');
                    list.push(line.split(' ')[1]);
                }
            })
        })

    })
}

const openXmlFile = ( file ) => {

    return readFile.read(file).then((text) => {

        if (  check(text) == true )
            return text;
        else
            throw new Error(Vue.i18n.translate('msg.error.notKicadProject'));

    }).then((text) => {

        return new Promise((resolve, reject) => {
            parser.parseString(text , function ( err , result ){
                if ( err ) reject(err);

                resolve(result);
            });
        });
    }).then((xmlObj)=> {
        fileList.components = [];

        xmlObj.export.components.map((components) => {
            components.comp.map((component) => {
                let compObj = {};

                compObj.ref = component.$.ref;
                compObj.type = _getTypeWithRef(compObj.ref);
                compObj.val = component.value[0];
                compObj.footprint = component.footprint[0];

                if ( component.fields ){
                    component.fields.map((fields) => {
                        fields.field.map((field) => {
                            if ( field.$.name.toLowerCase().includes("mfr. no") )
                                compObj.mfrnum = field._;
                        })
                    })
                }
                fileList.components.push(compObj);
            })
        })
        return fileList.components;
    }).then((components) => {

        let promises = [];
        fileList.components.map((compo , idx ) =>  {
            if ( compo.mfrnum != undefined){
                let p = price.get(compo.mfrnum).then((dataResult) => {

                    dataResult.Parts.MouserPart.map((MouserPart) => {
                        if ( MouserPart.ManufacturerPartNumber == compo.mfrnum )
                        {
                            fileList.components[idx].unitPrice = MouserPart.PriceBreaks.Pricebreaks[0].Price;
                        }
                    });

                }).catch((err) => {
                    new Error ( err );
                })
                promises.push( p );
            }
                
        })

        return Promise.all(promises);
    }).then(() => { 

        let components = fileList.components;
        let bom = {};
        components.map(component => {
            if ( bom[component.type] == undefined )
                bom[component.type] = {};

            if (bom[component.type][component.val] == undefined )
                bom[component.type][component.val] = {};

            if (bom[component.type][component.val].refs == undefined )
                bom[component.type][component.val].refs = [];

            bom[component.type][component.val].refs.push(component.ref);
            bom[component.type][component.val].footprint = component.footprint;
            bom[component.type][component.val].digikey = component.digikey;
            bom[component.type][component.val].mouser = component.mouser;
            bom[component.type][component.val].mfrnum = component.mfrnum;
            bom[component.type][component.val].unitPrice = component.unitPrice;
            
        });

        let listTemp = [];
        for ( let key in bom)
        {
            for ( let key2 in bom[key]){

                let objRefs = {};
                let refs = [];
                bom[key][key2].refs.map((ref , idx ) => {
                    if (objRefs[ref] == undefined ){
                        objRefs[ref] = true;
                    }
                }) 
                
                for ( let ref in objRefs)
                    refs.push(ref);
   
                let unitPrice = undefined;
                let unit = undefined;
                let priceByRef = "";
                if ( bom[key][key2].unitPrice ){
                    bom[key][key2].unitPrice = bom[key][key2].unitPrice.replace(',','.')
                    unitPrice = bom[key][key2].unitPrice.split(' ')[0].replace(',','.');
                    unit = bom[key][key2].unitPrice.split(' ')[1];

                    priceByRef = parseFloat(parseInt(refs.length) * parseFloat(unitPrice)).toFixed(3).toString() + " " + unit;
                }

                listTemp.push({ 
                    val : key2 ,
                    nbRefs : refs.length ,
                    refs :  refs ,
                    type : key ,
                    footprint : bom[key][key2].footprint ,
                    digikey : bom[key][key2].digikey,
                    mouser : bom[key][key2].mouser,
                    mfrnum : bom[key][key2].mfrnum,
                    unitPrice : bom[key][key2].unitPrice,
                    totalPrice : priceByRef ,
                });               
            }

        }

        listTemp.map((comp) => {
            if ( fileList.bom[comp.type] == undefined )
                fileList.bom[comp.type] = [];

            fileList.bom[comp.type].push(comp);
        });

        return fileList.bom;
    }).then((bom) => {

        return bom;
    }).catch(( err ) => {

        if ( err == undefined)
        {
            err = { message : Vue.i18n.translate('msg.error.errorOpeningFile')  }
        }

        throw new Error(err.message);
    })

}


const openPcbFile = (file) => {

}

const open = ( file ) => {
    fileList.schematics = [];
    fileList.components = [];
    fileList.bom = {};


    if ( file[0].endsWith(".pro") )
    {
        openProFile(file[0]);
    }
    else if ( file[0].endsWith(".xml") )
    {
        return openXmlFile(file[0]);
    }
    else if ( file[0].endsWith(".kicad_pcb") )
    {
        return openPcbFile(file[0]);
    }
}

const check = ( fileContent) => {

    return fileContent.toLowerCase().includes("eeschema");

}

const getSchematicFile = () => {

    return fileList.schematics;
}

const getComponents = () => {
    return fileList.components;
}

export default {
    check ,
    open,
    getSchematicFile,
    getComponents,
}