const sexp = require('node-sexp');

async function getSymbol(component, librarieName) {

    function _parse(comp) {
        let _sexp = "";
        for (let key of comp) {
            if (Array.isArray(key)) {
                _parse(comp[key]);
            } else {
                _sexp = sexp(key)
            }
             
        }
        return _sexp;
    }


    return new Promise(async (resolve, reject) => {
        try {
            let _comp = [...component];
            console.log(_parse(_comp));
        } catch (err) {
            reject(err);
        }
    });
}

export default {
    getSymbol,
}