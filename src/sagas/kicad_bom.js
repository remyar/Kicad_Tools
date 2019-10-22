import Action from '../actions';
import Api from '../api';
import { put, takeEvery } from 'redux-saga/effects'

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
                type ='bom.' + r.ref ;
            }
            
        })
    }
    return type;
}

export default function* getKicadBom(data) {
    try{
        console.log(data);
        let fileList = { components : [] , bom : {} };
        let fileExt = { name : "Kicad Bom .xml" , extensions : ["xml"] };

        let filesList = yield Api.File.openDialog(fileExt);

        let dataString = yield Api.File.read(filesList[0]);

        let fileObjXml = yield Api.Xml.parse(dataString);

        fileObjXml.export.components.map((components) => {
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
            });
        });

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
        for ( let key in bom) {
            for ( let key2 in bom[key]){
                let objRefs = {};
                let refs = [];
                bom[key][key2].refs.map((ref , idx ) => {
                    if (objRefs[ref] == undefined ){
                        objRefs[ref] = true;
                    }
                });

                for ( let ref in objRefs) {
                    refs.push(ref);
                }

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

        yield put({type : Action.kicad_file.KICAD_CREATE_BOM_SUCCESS , data : fileList.bom });
    } catch (e) {
        console.error(e);
        yield put({ type: Action.kicad_file.KICAD_CREATE_BOM_ERROR , data : { status : e.message , time : new Date().getTime() }})
    }
}