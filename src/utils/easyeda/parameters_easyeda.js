import parse_svg_path from "./svg_path_parser";

export const EasyedaPinType = {
    unspecified: 0,
    input: 1,
    output: 2,
    bidirectional: 3,
    power: 4
}

function convert_to_mm(dim) {
    return parseFloat(dim) * 10 * 0.0254;
}

function _getKeyFromValue(obj, value) {
    let result = "";
    Object.keys(obj).forEach((key) => {
        if (obj[key] == value) {
            result = key;
        }
    });
    return result;
}

export class EeSymbolPinDot {
    dot_x = 0.0;
    dot_y = 0.0;

    constructor(x, y) {
        this.dot_x = x;
        this.dot_y = y;
    }

}

export class EeSymbolPinName {
    is_displayed = false;
    pos_x = 0.0;
    pos_y = 0.0;
    rotation = 0;
    text = "";
    text_anchor = "";
    font = "";
    font_size = 0.0;

    constructor(input) {
        this.is_displayed = input[0] == "0" ? true : false;
        this.pos_x = parseFloat(input[1]);
        this.pos_y = parseFloat(input[2]);
        this.rotation = parseFloat(input[3]) || 0.0;
        this.text = input[4];
        this.text_anchor = input[5];
        this.font = input[6];
        this.font_size = parseFloat(input[7]);
    }
}

export class EeSymbolPinDotBis {
    is_displayed = false;
    circle_x = 0.0;
    circle_y = 0.0;

    constructor(is_displayed, circle_x, circle_y) {
        this.is_displayed = is_displayed == "show" ? true : false;
        this.circle_x = circle_x;
        this.circle_y = circle_y;
    }
}

export class EeSymbolPinPath {
    path = "";
    color = "";

    constructor(path, color) {
        this.path = path.replace("v", "h");
        this.color = color;
    }
}

export class EeSymbolBbox {
    x = 0.0;
    y = 0.0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class EeSymbolPinSettings {
    is_displayed = false;
    type = EasyedaPinType.unspecified;
    spice_pin_number = "";
    pos_x = 0.0;
    pos_y = 0.0;
    rotation = 0;
    id = "";
    is_locked = false;

    constructor(input) {
        this.is_displayed = input[0] == "show" ? true : false;
        this.type = input[1] == '' ? 0 : parseInt(input[1]);
        this.spice_pin_number = input[2];
        this.pos_x = parseFloat(input[3]);
        this.pos_y = parseFloat(input[4]);
        this.rotation = parseInt(input[5]) || 0.0;
        this.id = input[6];
        this.is_locked = input[7] == "0" ? false : true;
    }
}

export class EeSymbolInfo {
    name = "";
    prefix = "";
    package = "";
    manufacturer = "";
    datasheet = "";
    lcsc_id = "";
    jlc_id = "";

    constructor(name, prefix, _package, manufacturer, datasheet, lcsc_id, jlc_id) {
        this.name = name;
        this.prefix = prefix;
        this.package = _package;
        this.manufacturer = manufacturer;
        this.datasheet = datasheet;
        this.lcsc_id = lcsc_id;
        this.jlc_id = jlc_id;
    }
}

export class EeSymbol {
    info = {};
    bbox = {};
    pins = [];
    rectangles = [];
    circles = [];
    arcs = [];
    ellipses = [];
    polylines = [];
    polygons = [];
    paths = [];

    constructor(input) {
        if (typeof input == "object") {
            if (input.info != undefined) {
                this.info = new EeSymbolInfo(
                    input.info.name,
                    input.info.prefix,
                    input.info.package,
                    input.info.manufacturer,
                    input.info.datasheet,
                    input.info.lcsc_id,
                    input.info.jlc_id,
                );
            }
            if (input.bbox != undefined) {
                this.bbox = new EeSymbolBbox(
                    input.bbox.x,
                    input.bbox.y,
                );
            }
        }
    }
}

export class EeSymbolPinClock {
    is_displayed = false;
    path = "";

    constructor(is_displayed, path) {
        this.is_displayed = is_displayed == "show" ? true : false;
        this.path = path;
    }
}


export class EeSymbolPin {
    settings = {};
    pin_dot = {};
    pin_path = {};
    name = {};
    dot = {};
    clock = {};

    constructor(settings, pin_dot, pin_path, name, dot, clock) {
        this.settings = settings;
        this.pin_dot = pin_dot;
        this.pin_path = pin_path;
        this.name = name;
        this.dot = dot;
        this.clock = clock;
    }
}

export class EeFootprintInfo {
    name = "";
    fp_type = "";
    model_3d_name = ""

    constructor(name, fp_type, model_3d_name) {
        this.name = name;
        this.fp_type = fp_type;
        this.model_3d_name = model_3d_name;
    }
}

export class EeSymbolRectangle {
    pos_x = 0.0;
    pos_y = 0.0;
    rx = 0.0;
    ry = 0.0;
    width = 0.0;
    height = 0.0;
    stroke_color = "";
    stroke_width = "";
    stroke_style = "";
    fill_color = "";
    id = "";
    is_locked = false;

    constructor(pos_x, pos_y, rx, ry, width, height, stroke_color, stroke_width, stroke_style, fill_color, id, is_locked) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.rx = rx;
        this.ry = ry;
        this.width = width;
        this.height = height;
        this.stroke_color = stroke_color;
        this.stroke_width = stroke_width;
        this.stroke_style = stroke_style;
        this.fill_color = fill_color?.toLowerCase() != "none" ? true : false;
        this.id = id;
        this.is_locked = (is_locked == "true" || is_locked == "1") ? true : false;
    }
}

export class EeSymbolArc {
    path = [];
    helper_dots = "";
    stroke_color = "";
    stroke_width = "";
    stroke_style = "";
    fill_color = false;
    id = "";
    is_locked = false;

    constructor(path, helper_dots, stroke_color, stroke_width, stroke_style, fill_color, id, is_locked) {
        this.path = parse_svg_path(path);
        this.helper_dots = helper_dots;
        this.stroke_color = stroke_color;
        this.stroke_width = stroke_width;
        this.stroke_style = stroke_style;
        this.fill_color = fill_color?.toLowerCase() != "none" ? true : false;
        this.id = id;
        this.is_locked = (is_locked == "true" || is_locked == "1") ? true : false;
    }
}

export class EeSymbolPolyline {
    points = "";
    stroke_color = "";
    stroke_width = "";
    stroke_style = "";
    fill_color = false;
    id = "";
    is_locked = false;

    constructor(points, stroke_color, stroke_width, stroke_style, fill_color, id, is_locked) {
        this.points = points;
        this.stroke_color = stroke_color;
        this.stroke_style = stroke_width;
        this.stroke_style = stroke_style;
        this.fill_color = fill_color?.toLowerCase() != "none" ? true : false;
        this.id = id;
        this.is_locked = (is_locked == "true" || is_locked == "1") ? true : false;
    }
}

export class EeSymbolPolygon {
    constructor() {
    }
}

export class EeSymbolEllipse {
    center_x = 0.0;
    center_y = 0.0;
    radius_x = 0.0;
    radius_y = 0.0;
    stroke_color = "";
    stroke_width = "";
    stroke_style = "";
    fill_color = false;
    id = "";
    is_locked = false;

    constructor(center_x, center_y, radius_x, radius_y, stroke_color, stroke_width, stroke_style, fill_color, id, is_locked) {
        this.center_x = center_x;
        this.center_y = center_y;
        this.radius_x = radius_x;
        this.radius_y = radius_y;
        this.stroke_color = stroke_color;
        this.stroke_style = stroke_width;
        this.stroke_style = stroke_style;
        this.fill_color = fill_color?.toLowerCase() != "none" ? true : false;
        this.id = id;
        this.is_locked = (is_locked == "true" || is_locked == "1") ? true : false;
    }
}

export class EeSymbolCircle {
    center_x = 0.0;
    center_y = 0.0;
    radius = 0.0;
    stroke_color = "";
    stroke_width = "";
    stroke_style = "";
    fill_color = false;
    id = "";
    is_locked = false;

    constructor(center_x, center_y, radius, stroke_color, stroke_width, stroke_style, fill_color, id, is_locked) {
        this.center_x = center_x;
        this.center_y = center_y;
        this.radius = radius;
        this.stroke_color = stroke_color;
        this.stroke_style = stroke_width;
        this.stroke_style = stroke_style;
        this.fill_color = fill_color?.toLowerCase() != "none" ? true : false;
        this.id = id;
        this.is_locked = (is_locked == "true" || is_locked == "1") ? true : false;
    }
}

export class EeSymbolPath {
    paths = "";
    stroke_color = "";
    stroke_width = "";
    stroke_style = "";
    fill_color = false;
    id = "";
    is_locked = false;

    constructor(paths, stroke_color, stroke_width, stroke_style, fill_color, id, is_locked) {
        this.paths = paths;
        this.stroke_color = stroke_color;
        this.stroke_style = stroke_width;
        this.stroke_style = stroke_style;
        this.fill_color = fill_color?.toLowerCase() != "none" ? true : false;
        this.id = id;
        this.is_locked = (is_locked == "true" || is_locked == "1") ? true : false;
    }
}

export class ee_footprint {
    info = {};
    bbox = {};
    model_3d = {};
    pads = [];
    tracks = [];
    holes = [];
    circles = [];
    arcs = [];
    rectangles = [];
    texts = [];

    constructor(input) {
        if (typeof input == "object") {
            if (input.info != undefined) {
                this.info = input.info;
            }

            if (input.bbox != undefined) {
                this.bbox = input.bbox;
            }

            if (input.model_3d != undefined) {
                this.model_3d = input.model_3d;
            }
        }
    }
}

export class EeFootprintBbox {
    x = 0.0;
    y = 0.0;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    convert_to_mm() {
        this.x = convert_to_mm(this.x);
        this.y = convert_to_mm(this.y);
    }
}

export class EeFootprintCircle {
    cx = 0.0;
    cy = 0.0;
    radius = 0.0;
    stroke_width = 0.0;
    layer_id = 0;
    id = "";
    is_locked = false;

    constructor(cx, cy, radius, stroke_width, layer_id, id, is_locked) {
        this.cx = parseFloat(cx);
        this.cy = parseFloat(cy);
        this.radius = parseFloat(radius);
        this.stroke_width = parseFloat(stroke_width);
        this.layer_id = parseInt(layer_id);
        this.id = id;
        this.is_locked = is_locked == "0" || is_locked == "false" ? true : false;
    }

    convert_to_mm() {
        this.cx = convert_to_mm(this.cx);
        this.cy = convert_to_mm(this.cy);
        this.radius = convert_to_mm(this.radius);
        this.stroke_width = convert_to_mm(this.stroke_width);
    }

}

export class EeFootprintTrack {

    stroke_width = 0.0;
    layer_id = 0;
    net = "";
    points = "";
    id = "";
    is_locked = false;

    constructor(stroke_width, layer_id, net, points, id, is_locked) {
        this.stroke_width = parseFloat(stroke_width);
        this.layer_id = parseInt(layer_id);
        this.net = net;
        this.points = points;
        this.id = id;
        this.is_locked = is_locked == "0" || is_locked == "false" ? true : false;
    }

    convert_to_mm() {
        this.stroke_width = convert_to_mm(this.stroke_width);
    }
}

export class EeFootprintPad {
    shape = "";
    center_x = 0.0;
    center_y = 0.0;
    width = 0.0;
    height = 0.0;
    layer_id = 0;
    net = "";
    number = "";
    hole_radius = 0.0;
    points = "";
    rotation = 0.0;
    id = "";
    hole_length = 0.0;
    hole_point = "";
    is_plated = false;
    is_locked = false;

    constructor(shape, center_x, center_y, width, height, layer_id, net, number, hole_radius, points, rotation, id, hole_length, hole_point, is_plated, is_locked) {
        this.shape = shape;
        this.center_x = parseFloat(center_x);
        this.center_y = parseFloat(center_y);
        this.width = parseFloat(width);
        this.height = parseFloat(height);
        this.layer_id = parseInt(layer_id);
        this.net = net;
        this.number = number;
        this.hole_radius = parseFloat(hole_radius);
        this.points = points;
        this.rotation = parseFloat(rotation) || 0.0;
        this.id = id;
        this.hole_length = parseFloat(hole_length);
        this.hole_point = hole_point;
        this.is_plated = is_plated;
        this.is_locked = is_locked == "0" || is_locked == "false" ? true : false;
    }

    convert_to_mm() {
        this.center_x = convert_to_mm(this.center_x);
        this.center_y = convert_to_mm(this.center_y);
        this.width = convert_to_mm(this.width);
        this.height = convert_to_mm(this.height);
        this.hole_radius = convert_to_mm(this.hole_radius);
        this.hole_length = convert_to_mm(this.hole_length);
    }
}

export class EeFootprintHole {
    center_x = 0.0;
    center_y = 0.0;
    radius = 0.0;
    id = "";
    is_locked = false;

    constructor(center_x, center_y, radius, id, is_locked) {
        this.center_x = parseFloat(center_x);
        this.center_y = parseFloat(center_y);
        this.radius = parseFloat(radius);
        this.id = id;
        this.is_locked = is_locked == "0" || is_locked == "false" ? true : false;
    }
}

export class EeFootprintArc {
    stroke_width = 0.0;
    layer_id = 0;
    net = "";
    path = "";
    helper_dots = "";
    id = "";
    is_locked = false;

    constructor(stroke_width, layer_id, net, path, helper_dots, id, is_locked) {
        this.stroke_width = parseFloat(stroke_width);
        this.layer_id = parseInt(layer_id);
        this.net = net;
        this.path = path;
        this.helper_dots = helper_dots;
        this.id = id;
        this.is_locked = is_locked == "0" || is_locked == "false" ? true : false;
    }
}

export class EeFootprintRectangle {
    x = 0.0;
    y = 0.0;
    width = 0.0;
    height = 0.0;
    stroke_width = 0.0;
    id = "";
    layer_id = 0;
    is_locked = false;

    constructor(x, y, width, height, stroke_width, id, layer_id, is_locked) {
        this.x = parseFloat(x);
        this.y = parseInt(y);
        this.width = parseFloat(width);
        this.height = parseInt(height);
        this.stroke_width = parseFloat(stroke_width);
        this.id = id;
        this.layer_id = parseInt(layer_id);
        this.is_locked = is_locked == "0" || is_locked == "false" ? true : false;
    }

    convert_to_mm() {
        this.x = convert_to_mm(this.x);
        this.y = convert_to_mm(this.y);
        this.width = convert_to_mm(this.width);
        this.height = convert_to_mm(this.height);
    }
}

export class EeFootprintText {
    type = "";
    center_x = 0.0;
    center_y = 0.0;
    stroke_width = 0.0;
    rotation = 0;
    miror = "";
    layer_id = 0;
    net = "";
    font_size = 0.0;
    text = "";
    text_path = "";
    is_displayed = false;
    id = "";
    is_locked = false;

    constructor(type, center_x, center_y, stroke_width, rotation, miror, layer_id, net, font_size, text, text_path, is_displayed, id, is_locked) {
        this.type = type;
        this.center_x = parseFloat(center_x);
        this.center_y = parseFloat(center_y);
        this.stroke_width = parseFloat(stroke_width);
        this.rotation = parseInt(rotation) || 0;
        this.miror = miror;
        this.layer_id = parseInt(layer_id);
        this.net = net;
        this.font_size = parseFloat(font_size);
        this.text = text;
        this.text_path = text_path;
        this.is_displayed = is_displayed == "0" || is_displayed == "false" ? true : false;
        this.id = id;
        this.is_locked = is_locked == "0" || is_locked == "false" ? true : false;
    }

    convert_to_mm() {
        this.center_x = convert_to_mm(this.center_x);
        this.center_y = convert_to_mm(this.center_y);
        this.stroke_width = convert_to_mm(this.stroke_width);
        this.font_size = convert_to_mm(this.font_size);
    }
}

export class Ee3dModelBase {
    x = 0.0;
    y = 0.0;
    z = 0.0;

    constructor(x = 0.0 , y = 0.0 , z = 0.0){
        this.x = parseFloat(x);
        this.y = parseFloat(y);
        this.z = parseFloat(z);
    }

    convert_to_mm() {
        this.x = convert_to_mm(this.x);
        this.y = convert_to_mm(this.y);
        this.z = convert_to_mm(this.z);
    }
}

export class Ee3dModel {
    name = "";
    uuid = "";
    translation = new Ee3dModelBase();
    rotation = new Ee3dModelBase();
    raw_obj = "";

    constructor(name , uuid , translation , rotation , raw_obj = ""){
        this.name = name;
        this.uuid = uuid;
        this.translation = translation;
        this.rotation = rotation;
        this.raw_obj = raw_obj;
    }
    convert_to_mm() {
        this.translation.convert_to_mm();
    }
}