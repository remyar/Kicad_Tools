import xml2js from 'xml2js';

function parse(xml){
    let xmlParser = new xml2js.Parser();

    return new Promise((resolve , reject ) => {
        xmlParser.parseString(xml , ( err , result ) => {
            if ( err ){
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export default {
    parse,
}