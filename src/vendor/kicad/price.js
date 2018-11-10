import soap, { createClient } from 'soap';
import { resolve } from 'url';

const get = ( component )=> {
    var url = 'http://www.mouser.com/service/searchapi.asmx?WSDL';

    return new Promise((resolve , reject ) => {

        //resolve({});

        soap.createClient(url,  function(err, client){
            if ( err ) reject(err);

            if ( client )
            {
                client.addSoapHeader( '<MouserHeader xmlns="http://api.mouser.com/service"><AccountInfo><PartnerID>3aed3522-1134-44f9-9e2c-5b0ca35290c9</PartnerID></AccountInfo></MouserHeader>');

                client.SearchByPartNumber({ mouserPartNumber : component} , function(err, result){
                    if ( err ) reject(err);

                    resolve(result.SearchByPartNumberResult);

                });
            }
            else
                reject('Mouser SOAP API Error');
        });
    });
}

export default {    
    get,
}




