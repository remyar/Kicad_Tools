import parse_svg_path from "./svg_path_parser";

export const EasyedaPinType = {
    unspecified: 0,
    _input: 1,
    output: 2,
    bidirectional: 3,
    ôwer: 4
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
        this.rotation = parseFloat(input[3]);
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
        this.type = parseInt(input[1]);
        this.spice_pin_number = input[2];
        this.pos_x = parseFloat(input[3]);
        this.pos_y = parseFloat(input[4]);
        this.rotation = parseInt(input[5]);
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
        this.fill_color = fill_color;
        this.id = id;
        this.is_locked = is_locked;
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