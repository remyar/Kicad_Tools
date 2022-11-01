
function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}

function round_float_values(self) {
    Object.keys(self).forEach((key) => {
        if (typeof self[key] == "number") {
            if (isFloat(self[key]) == true) {
                self[key] = parseFloat(self[key].toFixed(2));
            }
        }
    })
}

export const KI_LAYERS = {
    1: "F.Cu",
    2: "B.Cu",
    3: "F.SilkS",
    4: "B.SilkS",
    5: "F.Paste",
    6: "B.Paste",
    7: "F.Mask",
    8: "B.Mask",
    10: "Edge.Cuts",
    11: "Edge.Cuts",
    12: "Cmts.User",
    13: "F.Fab",
    14: "B.Fab",
    15: "Dwgs.User",
    101: "F.Fab",
}

export const KI_PAD_SHAPE = {
    "ELLIPSE": "circle",
    "RECT": "rect",
    "OVAL": "oval",
    "POLYGON": "custom",
}

export const KI_PAD_LAYER = {
    1: "F.Cu F.Paste F.Mask",
    2: "B.Cu B.Paste B.Mask",
    3: "F.SilkS",
    11: "*.Cu *.Paste *.Mask",
    13: "F.Fab",
    15: "Dwgs.User",
}

export class KiFootprintInfo {
    name = "";
    fp_type = "";

    constructor(name, fp_type) {
        this.name = name;
        this.fp_type = fp_type;
    }
}

export class Ki3dModelBase {
    x = 0.0;
    y = 0.0;
    z = 0.0;

    constructor(x, y, z) {
        this.x = parseFloat(x);
        this.y = parseFloat(y);
        this.z = parseFloat(z);
    }
}

export class Ki3dModel {
    name = "";
    translation = new Ki3dModelBase();
    rotation = new Ki3dModelBase();
    raw_wrl = "";

    constructor(obj) {
        if (obj.name != undefined) {
            this.name = obj.name;
        }
        if (obj.translation != undefined) {
            this.translation = obj.translation;
        }
        if (obj.rotation != undefined) {
            this.rotation = obj.rotation;
        }
        if (obj.raw_wrl != undefined) {
            this.raw_wrl = obj.raw_wrl;
        }
    }
}

export class KiFootprint {
    info = {};
    model_3d = {};
    pads = [];
    tracks = [];
    vias = [];
    holes = [];
    circles = [];
    arcs = [];
    rectangles = [];
    texts = [];
    solid_regions = [];
    copper_areas = [];

    constructor(obj) {
        if (obj.info != undefined) {
            this.info = obj.info;
        }
        if (obj.model_3d != undefined) {
            this.model_3d = obj.model_3d;
        }
    }
}

export class KiFootprintPad {
    type = "";
    shape = "";
    pos_x = 0.0;
    pos_y = 0.0;
    width = 0.0;
    height = 0.0;
    layers = "";
    number = "";
    drill = 0.0;
    orientation = 0.0;
    polygon = "";

    constructor(obj) {
        this.type = obj.type || "";
        this.shape = obj.shape || "";
        this.pos_x = parseFloat(obj.pos_x) || 0.0;
        this.pos_y = parseFloat(obj.pos_y) || 0.0;
        this.width = parseFloat(obj.width) || 0.0;
        this.height = parseFloat(obj.height) || 0.0;
        this.layers = obj.layers || "";
        this.number = obj.number || "";
        this.drill = parseFloat(obj.drill) || 0.0;
        this.orientation = parseFloat(obj.orientation) || 0.0;
        this.polygon = obj.polygon || "";

        round_float_values(this);
    }
}

export class KiFootprintTrack {
    points_start_x = [];
    points_start_y = [];
    points_end_x = [];
    points_end_y = [];
    stroke_width = 0.0;
    layers = "";

    constructor(layers, stroke_width) {
        this.layers = layers || "";
        this.stroke_width = parseFloat(stroke_width) || 0.0;
    }
}

export class KiFootprintHole {
    pos_x = 0.0;
    pos_y = 0.0;
    size = 0.0;

    constructor(pos_x, pos_y, size) {
        this.pos_x = parseFloat(pos_x);
        this.pos_y = parseFloat(pos_y);
        this.size = parseFloat(size);

        round_float_values(this);
    }
}

export class KiFootprintCircle {
    cx = 0.0;
    cy = 0.0;
    end_x = 0.0;
    end_y = 0.0;
    layers = "";
    stroke_width = 0.0;

    constructor(cx, cy, end_x, end_y, layers, stroke_width) {

        this.cx = parseFloat(cx);
        this.cy = parseFloat(cy);
        this.end_x = parseFloat(end_x);
        this.end_y = parseFloat(end_y);
        this.layers = layers || "";
        this.stroke_width = parseFloat(stroke_width) || 0.0;

        round_float_values(this);
    }
}

export class KiFootprintRectangle {

}

export class KiFootprintText {
    pos_x = 0.0;
    pos_y = 0.0;
    orientation = 0.0;
    text = "";
    layers = "";
    font_size = 0.0;
    thickness = 0.0;
    display = "";
    mirror = "";

    constructor(pos_x, pos_y, orientation, text, layers, font_size, thickness, display, mirror) {
        this.pos_x = parseFloat(pos_x);
        this.pos_y = parseFloat(pos_y);
        this.orientation = parseFloat(orientation);
        this.text = text || "";
        this.layers = layers || "";
        this.font_size = parseFloat(font_size);
        this.thickness = parseFloat(thickness);
        this.display = display || "";
        this.laymirrorers = mirror || "";
        round_float_values(this);
    }
}

export class KiFootprintArc {
    start_x = 0.0;
    start_y= 0.0;
    end_x= 0.0;
    end_y= 0.0;
    angle= 0.0;
    layers="";
    stroke_width= 0.0;

    constructor(start_x, start_y, end_x, end_y, angle, layers, stroke_width) {
        
        this.start_x = parseFloat(start_x);
        this.start_y = parseFloat(start_y);
        this.end_x = parseFloat(end_x);
        this.end_y = parseFloat(end_y);
        this.angle = parseFloat(angle);
        this.layers = layers || "";
        this.stroke_width = parseFloat(stroke_width) || 0.0;

        round_float_values(this);
    }
}