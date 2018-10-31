import writeFile from '../file';

const exportToKicad = ( symbol , fileName )=>{

    let fileContent = "";

    function _putString(str){
        fileContent += str + "\n";
    }

    function _calcCood(val){
        return parseInt((parseFloat(val.toString())/2.54)*100.0);
    }
    
    function _calcOrientation(val){
        switch ( val )
        {
            case ( 'R180' ):
            {
                return 'L';
                break;
            }
            default:
            {
                return 'R';
            }
        }
    }

    function _calcPinLength(val)
    {
        switch(val){
            case 'middle':
                return 200;
        }
    }

    return new Promise((resolve, reject) => {
        

        _putString("EESchema-LIBRARY Version 2.3");
        _putString("#encoding utf-8");
        _putString("#");
        _putString("#" + symbol.name);
        _putString("#");

        _putString("DEF " + symbol.name + " " + "U" + " " + "0 40 Y Y 1 F N");
        _putString('F0 "U" -550 550 50 H V C CNN' );
        _putString('F1 "'+symbol.name+'" 100 550 50 H V L CNN');
        _putString('F2 "" 0 0 50 H I C CIN' );

        _putString("DRAW");

        //-- on envoi les commandes de dessins
        symbol.wire.map((w)=>{
            _putString("P 2 0 1 0 " + _calcCood(w.x1) + " " + _calcCood(w.y1) + " " + _calcCood(w.x2)+ " " + _calcCood(w.y2) + " N")
        });

        symbol.pin.map((p , idx ) => {
            _putString("X " + p.name + " " + ( idx + 1).toString() + " " + _calcCood(p.x) + " " + + _calcCood(p.y) + " "+ _calcPinLength(p.length) +" " + _calcOrientation(p.rot) + " 50 50 1 1 I")
        });

        _putString("ENDDRAW");
        _putString("ENDDEF");
        _putString("#");
        _putString("#End Library");

        writeFile.write(fileName , fileContent ).then((data)=>{
            resolve(data);
        }).catch((err)=>{
            reject(err);
        });
    });

}

export default {
    exportToKicad,
}