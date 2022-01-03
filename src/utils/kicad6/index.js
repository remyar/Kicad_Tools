import ComponentsLibs from './libs/component'

async function convertFromkicad5Librarie(librarieFile) {
    let file = [];
    let factor = 39.37;

    file.push("(kicad_symbol_lib (version 20211014) (generator kicad_tools)");
    let lines = librarieFile.split('\n').map(line => { return line.replace('\r', '') });

    let openbracket = [];
    lines.forEach((line) => {
        if (line.startsWith("EESchema") || line.startsWith("#")) {

        } else {
            if (line.startsWith("DEF ")) {
                openbracket.push(true);
                let words = line.split(" ");
                file.push('(symbol "' + words[1] + '" (pin_names (offset 0)) (in_bom yes) (on_board yes)');
            } else if (line.startsWith("F")){
                //-- properties
            }

        }
    });

    file.push(")");
    return file.join('\n');
}

async function parseKicadNetlist(str) {
    try {
        let netlistParsed = await ComponentsLibs.LoadComponentFromNET(str);
        let res = await ComponentsLibs.ExtractAndSortComponents(netlistParsed);
        let components = await ComponentsLibs.ApplaySort(res);
        return components;
    } catch (err) {
        throw Error(err)
    }
}


export default {
    convertFromkicad5Librarie,
    parseKicadNetlist
}