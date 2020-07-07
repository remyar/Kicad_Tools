

async function convertComponent(eagleComponents) {

    let fileContent = "";

    function _putString(str) {
        fileContent += str + "\n";
    }

    function _calcCood(val) {
        return parseInt((parseFloat(val.toString()) / 2.54) * 100.0);
    }

    function _calcOrientation(val) {
        switch (val) {
            case ('R180'):
                return 'L';
            default:
                return 'R';
        }
    }

    function _calcPinLength(val) {
        switch (val) {
            case 'middle':
                return 200;
            case 'short':
                return 100;
            case 'point':
                return 0;
            default:
                return 300;
        }
    }


    _putString("EESchema-LIBRARY Version 2.3");
    _putString("#encoding utf-8");

    eagleComponents.symbols.map((symbol) => {

        _putString("#");
        _putString("#" + symbol.name);
        _putString("#");

        _putString("DEF " + symbol.name + " " + "U" + " " + "0 40 Y Y 1 F N");
        _putString('F0 "U" -550 550 50 H V C CNN');
        _putString('F1 "' + symbol.name + '" 100 550 50 H V L CNN');
        _putString('F2 "" 0 0 50 H I C CIN');

        _putString("DRAW");

        //-- on envoi les commandes de dessins
        symbol.wire.map((w) => {
            _putString("P 2 0 1 0 " + _calcCood(w.x1) + " " + _calcCood(w.y1) + " " + _calcCood(w.x2) + " " + _calcCood(w.y2) + " N")
        });

        symbol.pin.map((p, idx) => {
            _putString("X " + p.name + " " + (idx + 1).toString() + " " + _calcCood(p.x) + " " + + _calcCood(p.y) + " " + _calcPinLength(p.length) + " " + _calcOrientation(p.rot) + " 50 50 1 1 I")
        });

        _putString("ENDDRAW");
        _putString("ENDDEF");
    });

    _putString("#");
    _putString("#End Library");

    return fileContent;
}

async function convertFootprint(eagleComponents) {

    let footprints = [];

    eagleComponents.packages.map((module) => {

        let fileContent = "";

        function _mirror(val) {
            return (-1 * parseFloat(val));
        }

        function _putString(str) {
            fileContent += str + "\n";
        }

        function _getLayer(eagleLayer) {
            let layers = [
                { eagle: "1", kicad: "F.Cu" },
                { eagle: "16", kicad: "B.Cu" },
                { eagle: "20", kicad: "Edge.Cuts" },
                { eagle: "21", kicad: "F.SilkS" },
                { eagle: "22", kicad: "B.SilkS" }
            ]

            return layers.find(el => el.eagle === eagleLayer)?.kicad ?? "Rescue";
        }

        function _calcOrientation(rotation) {
            return rotation?.replace('R', '').replace('M', '') ?? "180";
        }

        _putString("(module " + module.name + " (layer F.Cu) (tedit 5D9FD4A1)");

        module.wire && module.wire.map((_wire) => {
            _putString("  (fp_line (start " + _wire.x1 + " " + _mirror(_wire.y1) + ") (end " + _wire.x2 + " " + _mirror(_wire.y2) + ") (layer " + _getLayer(_wire.layer) + ") (width " + _wire.width + "))");
        })

        module.text && module.text.map((_text) => {
            _putString("  (fp_text user \"" + _text.text + "\" (at " + (parseFloat(_text.x) - (parseFloat(_text.size)/2)) + " " + _mirror(_text.y) + " " + _calcOrientation(_text.rot) + ") (layer " + _getLayer(_text.layer) + ") (effects (font (size 1 1) (thickness 0.15))))");
        });

        module.circle && module.circle.map((_circle) => {
            _putString("  (fp_circle (center " + _circle.x + " " + _mirror(_circle.y) + ") (end " + (parseFloat(_circle.x) + parseFloat(_circle.radius)) + " " + _mirror(_circle.y) + ") (layer " + _getLayer(_circle.layer) + ") (width " + _circle.width + "))");
        });

        module.smd && module.smd.map((_smd) => {

        });

        module.pad && module.pad.map((_pad) => {

            let idx = 0;
            eagleComponents.symbols.map((symbol) => {
                idx = symbol.pin.findIndex(el => el.name === _pad.name) + 1;
            });

            _putString("  (pad " + idx + " thru_hole circle (at " + _pad.x + " " + _mirror(_pad.y) + ") (size " + _pad.diameter + " " + _pad.diameter + ") (drill " + _pad.drill + ") (layers *.Cu *.Mask))");
        });

        _putString(")");

        footprints.push(fileContent);
    });

    return footprints;
}

export default {
    convertComponent,
    convertFootprint
}