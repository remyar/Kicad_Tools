import ComponentsLibs from './libs/component'
import sch_legacy_plugin from './sch_legacy_plugin';
import sch_sexpr_plugin from './sch_sexpr_plugin';

async function convertFromkicad5Librarie(librarieFile) {

    try {
        let symbols = await sch_legacy_plugin.Load(librarieFile);
        let str = await sch_sexpr_plugin.Save(symbols);
        return str;
    } catch (err) {
        throw Error(err);
    }
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
    parseKicadNetlist,
}