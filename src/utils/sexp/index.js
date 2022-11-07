const sexp = require('node-sexp');

async function getSymbol(component, librarieName) {

    function _parse(comp) {

        let _tab = [];

        for (let i = 0; i < comp.length; i++) {

            if (Array.isArray(comp[i])) {
                _tab.push(_parse(comp[i]));
            } else {
                if (typeof comp[i] == "string") {
                    _tab.push(comp[i]);
                } else if (typeof comp[i] == "object") {
                    _tab.push('"' + comp[i].toString() + '"');
                }
            }
        }
        return '(' + _tab.join(" ") + ')'
    }


    return new Promise(async (resolve, reject) => {
        try {
            let _comp = [...component];
            resolve(_parse(_comp));
        } catch (err) {
            reject(err);
        }
    });
}

export default {
    getSymbol,
}