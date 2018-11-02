import readFile from '../file';
import xml2js from 'xml2js';

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
    if ( ref != undefined )
    {
        if ( ref.startsWith('R') )
        {
            type = "Resistance(s)";
        }
        if ( ref.startsWith('C') )
        {
            type = "Condensateur(s)";
        }
        if ( ref.startsWith('D') )
        {
            type = "Diode(s)";
        }
        if ( ref.startsWith('U') || ref.startsWith('IC') )
        {
            type = "Circuit Intégré(s)";
        }
        if ( ref.startsWith('Q') || ref.startsWith('T') )
        {
            type = "Transistor(s)";
        }
        if ( ref.startsWith('J') || ref.startsWith('P'))
        {
            type = "Connecteur(s)";
        }
    }
    return type;
}

const openProFile = ( proFile ) => {

    let schList = [];
    return readFile.read(proFile.replace('.pro' , ".sch")).then((fileContent) => {

        if (  check(fileContent) == true )
            return fileContent;
        else
            throw new Error("Ceci n'est pas un projet Kicad");

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
            throw new Error("Ceci n'est pas un projet Kicad");

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
   
                listTemp.push({ 
                    val : key2 ,
                    nbRefs : refs.length ,
                    refs :  refs ,
                    type : key ,
                    footprint : bom[key][key2].footprint ,
                    digikey : bom[key][key2].digikey,
                    mouser : bom[key][key2].mouser,
                    mfrnum : bom[key][key2].mfrnum,
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

        return bom
    }).catch(( err ) => {

        if ( err == undefined)
        {
            err = { message : "Une erreur est survenue a l'ouverture du fichier" }
        }

        throw new Error(err.message);
    })

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
}
/*
const open = ( file ) => {

    fileList.schematics = [];
    fileList.components = [];
    fileList.bom = {};
    return readFile.read(file).then((result) => {

        return result;

    }).then((text) => {

        if (  check(text) == true )
            return text;
        else
            throw new Error("Ceci n'est pas un projet Kicad");

    }).then((text) => {
        fileList.schematics = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\t/g, '\n').trim().split("\n");
        return text;
    }).then((text) => { 
        let componentListRaw = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim().split("$EndDescr")[1].split('$EndComp');
        componentListRaw.map((rawComp ) => {
            let rowCompTab = rawComp.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\t/g, '\n').trim().split("\n");
            let compObj = {};
            rowCompTab.map(( lcomp ) => {
                lcomp = lcomp.replace(/"/g, '');

                if ( lcomp.includes("F 0") )
                {
                    compObj.ref = lcomp.split(" ")[2];

                    if ( compObj.ref.includes("#") == true )
                        compObj.ref = undefined;

                    if ( compObj.ref != undefined )
                    {
                        if ( compObj.ref.startsWith('R') )
                        {
                            compObj.type = "Resistance(s)";
                        }
                        if ( compObj.ref.startsWith('C') )
                        {
                            compObj.type = "Condensateur(s)";
                        }
                        if ( compObj.ref.startsWith('D') )
                        {
                            compObj.type = "Diode(s)";
                        }
                        if ( compObj.ref.startsWith('U') || compObj.ref.startsWith('IC') )
                        {
                            compObj.type = "Circuit Intégré(s)";
                        }
                        if ( compObj.ref.startsWith('Q') || compObj.ref.startsWith('T') )
                        {
                            compObj.type = "Transistor(s)";
                        }
                        if ( compObj.ref.startsWith('J') || compObj.ref.startsWith('P'))
                        {
                            compObj.type = "Connecteur(s)";
                        }
                    }
                }
                if ( lcomp.includes("F 1") )
                {
                    compObj.val = lcomp.split(" ")[2];
                }
                if ( lcomp.includes("F 2") )
                {
                    compObj.footprint = lcomp.split(" ")[2];
                }
                if ( lcomp.toLowerCase().includes("mfr. no") ){
                    compObj.mfrnum = lcomp.split(" ")[2];
                }
                if ( lcomp.toLowerCase().includes("digikey") ){
                    compObj.digikey = lcomp.split(" ")[2];
                }
                if ( lcomp.toLowerCase().includes("mouser") ){
                    compObj.mouser = lcomp.split(" ")[2];
                }
            });

            if ( compObj.ref )
                fileList.components.push(compObj);
        });

        return fileList.components;
    }).then((components) => { 

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
   
                listTemp.push({ 
                    val : key2 ,
                    nbRefs : refs.length ,
                    refs :  refs ,
                    type : key ,
                    footprint : bom[key][key2].footprint ,
                    digikey : bom[key][key2].digikey,
                    mouser : bom[key][key2].mouser,
                    mfrnum : bom[key][key2].mfrnum,
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

        return bom
    }).catch(( err ) => {

        if ( err == undefined)
        {
            err = { message : "Une erreur est survenue a l'ouverture du fichier" }
        }

        throw new Error(err.message);
    })
}
*/
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