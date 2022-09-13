
export const KiPinType = {
    unspecified: 0,
    _input: 1,
    output: 2,
    bidirectional: 3,
    ôwer: 4
}

export const KiPinStyle = {
    line: 0,
    inverted: 1,
    clock: 2,
    inverted_clock: 3,
    input_low: 4,
    clock_low: 5,
    output_low: 6,
    edge_clock_high: 7,
    non_logic: 8,
}

export class KiSymbolRectangle {
    pos_x0 = 0.0;
    pos_y0 = 0.0;
    pos_x1 = 0.0;
    pos_y1 = 0.0;
    constructor(pos_x0, pos_y0) {
        this.pos_x0 = pos_x0;
        this.pos_y0 = pos_y0;
    }
}

export class KiSymbolPin {
    name = "";
    number = "";
    style = KiPinStyle.line;
    type = KiPinType.unspecified;
    orientation = 0.0;
    pos_x = 0.0;
    pos_y = 0.0;

    constructor(name, number, style, type, orientation, pos_x, pos_y) {
        this.name = name;
        this.number = number;
        this.style = style;
        this.type = type;
        this.orientation = orientation;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
    }
}


export class KiSymbolInfo {
    name = "";
    prefix = "";
    package = "";
    manufacturer = "";
    datasheet = "";
    lcsc_id = "";
    jlc_id = "";
    y_low = 0.0;
    y_high = 0.0;

    constructor(name, prefix, _package, manufacturer, datasheet, lcsc_id, jlc_id, y_low = 0.0, y_high = 0.0) {
        this.name = name;
        this.prefix = prefix;
        this.package = _package;
        this.manufacturer = manufacturer;
        this.datasheet = datasheet;
        this.lcsc_id = lcsc_id;
        this.jlc_id = jlc_id;
        this.y_low = y_low;
        this.y_high = y_high;
    }

    export_v6() {
        let property_template = '(property "{key}" "{value}" (id {id_}) (at 0 {pos_y} 0) (effects (font (size {font_size} {font_size}) {style}) {hide}))';
        let field_offset_y = 5.08;
        let header = [];
        header.push(property_template.replace("{key}", "Reference")
            .replace("{value}", this.prefix)
            .replace("{id_}", 0)
            .replace("{pos_y}", this.y_high + field_offset_y)
            .replace("{font_size}", 1.27)
            .replace("{font_size}", 1.27)
            .replace("{style}", "")
            .replace("{hide}", "")
        );

    }

    export_v5() {

    }

    export(kicad_version) {
        return kicad_version == 6 ? this.export_v6() : this.export_v5();
    }
}

export class KiSymbolCircle {
    pos_x = 0.0;
    pos_y = 0.0;
    radius = 0.0;
    background_filling = false;

    constructor(pos_x, pos_y, radius, background_filling) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.radius = radius;
        this.background_filling = background_filling;
    }
}

export class KiSymbol {
    info = {};
    pins = [];
    rectangles = [];
    circles = [];
    arcs = [];
    polygons = [];
    beziers = [];

    constructor(info, pins, rectangles, circles, arcs, polygons, beziers) {
        this.info = info;
        this.pins = pins;
        this.rectangles = rectangles;
        this.circles = circles;
        this.arcs = arcs;
        this.polygons = polygons;
        this.beziers = beziers;
    }

    export_handler(kicad_version) {
        //Get y_min and y_max to put component info
        let _y_low = 999999999999;
        let _y_high = -999999999999;
        if (this.pins) {
            for (let pin of this.pins) {
                _y_low = Math.min(_y_low, pin.pos_y);
                _y_high = Math.max(_y_high, pin.pos_y);
            }
        } else {
            _y_low = 0;
            _y_high = 0;
        }
        this.info.y_low = _y_low;
        this.info.y_high = _y_high;

        let sym_export_data = {};
        for (let _field in this) {
            let shapes = this[_field];
            if (shapes.length > 0) {
                console.log(shapes);
            } else {
                sym_export_data[_field] = shapes.export(kicad_version);
            }

        }
        return sym_export_data;
    }

    export_v6() {
        let sym_export_data = this.export_handler(6)
    }

    export_v5() {

    }

    export(kicad_version = 6) {
        let component_data = kicad_version == 6 ? this.export_v6() : this.export_v5();
        return component_data;
    }
}