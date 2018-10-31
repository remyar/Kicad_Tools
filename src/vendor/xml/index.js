export default {

    parse : ( text ) =>{
        let xml = {} ;

        let tab = text.replace(/\r/g , '' ).replace(/\t/g , '' ).split("\n");

        tab.map((line) =>{
            line = line.trim();

            if ( line.startsWith("<?xml") )
                return;
            if ( line.startsWith("<!DOCTYPE") )
                return;

            if ( line.startsWith("<") && line.endsWith("<") ) 
            {
                //-- ouverture balise
                line.replace("<" , '').replace(">",'');
                line = line.trim();

                
            }
        });
    }
}