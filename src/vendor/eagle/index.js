import readFile from '../file';
import xml2js from 'xml2js';
import xml from '../xml';
import drawing from './draw';
import exportToKicad from './export';

let parser = new xml2js.Parser();

let fileList = {
    symbols : [],
    packages : []
}

const open = ( file ) => {
    fileList.symbols = [];
    fileList.packages = [];
    return readFile.read(file).then((result) => {
        return result;
    }).then((text) => {

        if (  check(text) == true )
            return text;
        else
            throw new Error("Ceci n'est pas une libraire Eagle");

    }).then((text) => {

        return new Promise((resolve, reject) => {
            parser.parseString(text , function ( err , result ){
                if ( err ) reject(err);

                resolve(result);
            });
        });
    }).then((xmlObj) => {  

        xmlObj.eagle.drawing.map((drawing) => {
            drawing.library.map((library) => {
                library.symbols.map((symbols) => {
                    symbols.symbol.map((symbol) => {
                        let s = {};
                        s.description = symbol.description;
                        s.name = symbol.$.name;
                        s.pin=[];
                        symbol.pin.map((pin) =>{
                            s.pin.push(pin.$);
                        });

                        s.text = [];
                        symbol.text.map((text) => {
                            let o = text.$;
                            o.text = text._;
                            s.text.push(o);
                        });

                        s.wire = [];
                        symbol.wire.map((wire) => {
                            s.wire.push(wire.$);
                        });

                        fileList.symbols.push(s);
                    });
                });
            });
        });

        xmlObj.eagle.drawing.map((drawing) => {
            drawing.library.map((library) => {
                library.packages.map((footprints) => {
                    footprints.package.map((pack) => {
                        let s = {};
                        s.description = pack.description;
                        s.name = pack.$.name;

                        s.circle=[];
                        pack.circle.map((circle) =>{
                            s.circle.push(circle.$);
                        });

                        s.text = [];
                        pack.text.map((text) => {
                            let o = text.$;
                            o.text = text._;
                            s.text.push(o);
                        });

                        s.smd=[];
                        pack.smd.map((smd) => {
                            s.smd.push(smd.$);
                        });

                        s.wire = [];
                        pack.wire.map((wire) => {
                            s.wire.push(wire.$);
                        });

                        fileList.packages.push(s);
                    });
                });
            });

        });

        return xmlObj;

    }).catch(( err ) => {

        if ( err == undefined)
        {
            err = { message : "Une erreur est survenue a l'ouverture du fichier" }
        }

        throw new Error(err.message);
    })
}

const check = ( fileContent) => {
    return fileContent.includes("eagle SYSTEM");
}

const getSymbols = () => {
    return fileList.symbols;
}

const getFootprints = () => {
    return fileList.packages;
}

const draw = (element , data , idx , factor ) => {
    drawing.draw(element,data[idx] , factor );
}

const exportToFile = (symbol , fileName) => {
    return exportToKicad.exportToKicad(symbol,fileName);
}

export default {
    check ,
    open,
    draw,
    getSymbols,
    getFootprints,
    exportToFile,
}