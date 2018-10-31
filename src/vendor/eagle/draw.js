import Konva from 'konva';


let _startMult = 5;
function _drawLine(layer , wire )
{
    let x1 = parseFloat(wire.x1.toString())*_startMult;
    let x2 = parseFloat(wire.x2.toString())*_startMult;

    let y1 = parseFloat(wire.y1.toString())*_startMult;
    let y2 = parseFloat(wire.y2.toString())*_startMult; 

    let line = new Konva.Line({ points: [x1, y1, x2, y2] , stroke: 'red' , strokeWidth: 1 });

    layer.add(line);
}

function _drawPin(layer , pin ){

    let x1 = parseFloat(pin.x.toString())*_startMult;
    let y1 = parseFloat(pin.y.toString())*_startMult;

    let x2 = x1;
    let y2 = y1;

    let pinLength = 0;

    switch ( pin.length ){
        case ( "point" ):
        {
            pinLength = 1;
            break;
        }
        case ( "short" ):
        {
            pinLength = 2.5;
            break;
        }
        case ( "middle" ):
        {
            pinLength = 5;
            break;
        }
        case ( "long" ):
        {
            pinLength = 7.5;
            break;
        }
    }



    switch ( pin.rot)
    {
        case ( "R180"):
        {
            x2 = x1 - pinLength*_startMult;
            break;
        }
        default:
        {
            x2 = x1 + pinLength*_startMult;
            break;
        }
    }

    let line = new Konva.Line({ points: [x1, y1, x2, y2] , stroke: 'red' , strokeWidth: 1 });
    layer.add(line);

    let text = new Konva.Text( {
        x: x2 + 2,
        y: y2+5,
        text: pin.name,
        //rotation : rotate,
        fontSize: 10,
        fontFamily: 'Calibri',
        fill: 'green',
        scaleY : -1,
        //scaleX : mirroX,
    })

    switch ( pin.rot)
    {
        case ( "R180"):
        {
            text.setOffset({
                x: text.getWidth() + 5
            })
            break;
        }
    }

    layer.add(text);


}

function _drawText(layer , t ){

    let x1 = parseFloat(t.x.toString())*_startMult;
    let y1 = parseFloat(t.y.toString())*_startMult;

    let x2 = x1;
    let y2 = y1;

    let text = new Konva.Text( {
        x: x1,
        y: y1,
        text: t.text,
        //rotation : rotate,
        fontSize: _startMult * parseFloat(t.size.toString()),
        fontFamily: 'Calibri',
        fill: 'green',
        scaleY : -1,
        //scaleX : mirroX,
    })
    layer.add(text);
}

function _drawCircle(layer , c ){

    let radius = parseFloat(c.radius.toString())*_startMult;
    let x1 = parseFloat(c.x.toString())*_startMult;
    let y1 = parseFloat(c.y.toString())*_startMult;
    // create circle
    var circle = new Konva.Circle({
        radius: radius,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1,
        x: x1,
        y: y1,
    });

    layer.add(circle);
}

function _drawSmd(layer , c){

    let x1 = parseFloat(c.x.toString())*_startMult;
    let y1 = parseFloat(c.y.toString())*_startMult;

    let width = parseFloat(c.dx.toString())*_startMult;
    let height = parseFloat(c.dy.toString())*_startMult;

    x1 = x1 + height / 2 ;
    y1 = y1 - width / 2;
    let rotation = parseFloat(c.rot.toString().replace("R" , ''));
    let roundness = parseFloat(c.roundness.toString()) / 10.0;

    var rect = new Konva.Rect({
        x : x1,
        y : y1,
        width : width,
        height : height,
        fill: 'red',
        stroke: 'black',
        strokeWidth: 1,
        rotation : rotation,
        cornerRadius : roundness
    });

    layer.add(rect);
}

const draw = (element , symbol , factor )=>{

    if ( symbol == undefined )
        return;

    if ( factor == undefined )
        factor = 5;

    _startMult = parseFloat(factor.toString());
    let canvas = document.getElementById(element);

    var stage = new Konva.Stage({
        container: element,
        width: canvas.width,
        height: canvas.height,
        draggable : true,
        scale : { x:1 , y:-1 },
    });

    var lines = new Konva.Layer({});
    if ( symbol.wire == undefined)
        symbol.wire  = [];
    //-- dessin des lignes
    symbol.wire.map((w)=>{
        _drawLine(lines,w);
    });

    var pins = new Konva.Layer({});
    if ( symbol.pin == undefined)
        symbol.pin  = [];
    symbol.pin.map((p) => {
        _drawPin(pins,p)
    });

    var texts = new Konva.Layer({});
    if ( symbol.text == undefined)
        symbol.text  = [];
    symbol.text.map((t) => {
        _drawText(texts,t)
    });

    var circles = new Konva.Layer({});
    if ( symbol.circle == undefined)
        symbol.circle  = [];
    //-- dessin des lignes
    symbol.circle.map((c)=>{
        _drawCircle(circles,c);
    });

    var smds = new Konva.Layer({});
    if ( symbol.smd == undefined)
        symbol.smd  = [];
    //-- dessin des lignes
    symbol.smd.map((c)=>{
        _drawSmd(smds,c);
    });

    // add the layer to the stage
    stage.add(lines);
    stage.add(pins);
    stage.add(texts);
    stage.add(circles);
    stage.add(smds);

    var scaleBy = 1.2;
    window.addEventListener("wheel" , function(e){
        e.preventDefault();

        var oldScale = stage.scaleX();

        let xCalc = stage.getPointerPosition().x / oldScale - stage.x() / oldScale;
        let yCalc = stage.getPointerPosition().y / oldScale - stage.y() / oldScale;

        var mousePointTo = {
            x: xCalc,
            y: yCalc,
        };

        var newScale = e.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;
        stage.scale({ x: newScale, y: -newScale });

        var newPos = {
            x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
        };
        stage.position(newPos);
        stage.batchDraw();

    })
}

export default {
    draw,
}