
function sanitize_fields(name) {
    return name.replace(" ", "").replace("/", "_");
}

export const KiPinType = {
    input: 0,
    output: 1,
    bidirectional: 2,
    tri_state: 3,
    passive: 4,
    free: 5,
    unspecified: 6,
    power_in: 7,
    power_out: 8,
    open_collector: 9,
    open_emitter: 10,
    no_connect: 11,
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


function _getKeyFromValue(obj, value) {
    let result = "";
    Object.keys(obj).forEach((key) => {
        if (obj[key] == value) {
            result = key;
        }
    });
    return result;
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

    export_v6() {

    }

    export_v5() {

    }

    export(kicad_version) {
        return kicad_version == 6 ? this.export_v6() : this.export_v5();
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

    export_v6() {
        let template = '(pin {pin_type} {pin_style}\r\n';
        template += '\t';
        template += '(at {x} {y} {orientation})\r\n';
        template += '\t';
        template += '(length {pin_length})\r\n';
        template += '\t';
        template += '(name "{pin_name}" (effects (font (size {name_size} {name_size}))))\r\n';
        template += '\t';
        template += '(number "{pin_num}" (effects (font (size {num_size} {num_size}))))\r\n';
        template += ')';

        template = template.replace("{pin_type}", _getKeyFromValue(KiPinType, this.type)/*.replace("_", "")*/);
        template = template.replace("{pin_style}", _getKeyFromValue(KiPinStyle, this.style).replace("_", ""));
        template = template.replace("{x}", this.pos_x.toFixed(2));
        template = template.replace("{y}", this.pos_y.toFixed(2));
        template = template.replace("{orientation}", (180.0 + this.orientation) % 360);
        template = template.replace("{pin_length}", 2.54);
        template = template.replace("{pin_name}", this.name.replace(" ", ""));
        template = template.replace("{name_size}", 1.27);
        template = template.replace("{name_size}", 1.27);
        template = template.replace("{pin_num}", this.number);
        template = template.replace("{num_size}", 1.27);
        template = template.replace("{num_size}", 1.27);

        return template;
    }

    export_v5() {

    }

    export(kicad_version) {
        return kicad_version == 6 ? this.export_v6() : this.export_v5();
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
        header.push(property_template.replace("{key}", "Value")
            .replace("{value}", this.name)
            .replace("{id_}", 1)
            .replace("{pos_y}", (this.y_low - field_offset_y).toFixed(2))
            .replace("{font_size}", 1.27)
            .replace("{font_size}", 1.27)
            .replace("{style}", "")
            .replace("{hide}", "")
        );

        if (this.package) {
            field_offset_y += 2.54;
            header.push(property_template.replace("{key}", "Footprint")
                .replace("{value}", this.package)
                .replace("{id_}", 2)
                .replace("{pos_y}", (this.y_low - field_offset_y).toFixed(2))
                .replace("{font_size}", 1.27)
                .replace("{font_size}", 1.27)
                .replace("{style}", "")
                .replace("{hide}", "hide")
            );
        }

        if (this.datasheet) {
            field_offset_y += 2.54;
            header.push(property_template.replace("{key}", "Datasheet")
                .replace("{value}", this.datasheet)
                .replace("{id_}", 3)
                .replace("{pos_y}", (this.y_low - field_offset_y).toFixed(2))
                .replace("{font_size}", 1.27)
                .replace("{font_size}", 1.27)
                .replace("{style}", "")
                .replace("{hide}", "hide")
            );
        }

        if (this.manufacturer) {
            field_offset_y += 2.54;
            header.push(property_template.replace("{key}", "Manufacturer")
                .replace("{value}", this.manufacturer)
                .replace("{id_}", 4)
                .replace("{pos_y}", (this.y_low - field_offset_y).toFixed(2))
                .replace("{font_size}", 1.27)
                .replace("{font_size}", 1.27)
                .replace("{style}", "")
                .replace("{hide}", "hide")
            );
        }

        if (this.lcsc_id) {
            field_offset_y += 2.54;
            header.push(property_template.replace("{key}", "LCSC Part")
                .replace("{value}", this.lcsc_id)
                .replace("{id_}", 5)
                .replace("{pos_y}", (this.y_low - field_offset_y).toFixed(2))
                .replace("{font_size}", 1.27)
                .replace("{font_size}", 1.27)
                .replace("{style}", "")
                .replace("{hide}", "hide")
            );
        }

        if (this.jlc_id) {
            field_offset_y += 2.54;
            header.push(property_template.replace("{key}", "JLC Part")
                .replace("{value}", this.jlc_id)
                .replace("{id_}", 6)
                .replace("{pos_y}", (this.y_low - field_offset_y).toFixed(2))
                .replace("{font_size}", 1.27)
                .replace("{font_size}", 1.27)
                .replace("{style}", "")
                .replace("{hide}", "hide")
            );
        }

        return header;
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

    constructor(pos_x, pos_y, radius, background_filling = false) {
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.radius = radius;
        this.background_filling = background_filling;
    }

    export_v6() {
        let template = '(circle\r\n';
        template += '\t';
        template += '(center {pos_x} {pos_y})\r\n';
        template += '\t';
        template += '(radius {radius})\r\n';
        template += '\t';
        template += '(stroke (width {line_width}) (type default) (color 0 0 0 0))\r\n';
        template += '\t';
        template += '(fill (type {fill}))\r\n';
        template += ')';

        template = template.replace("{pos_x}", this.pos_x.toFixed(2));
        template = template.replace("{pos_y}", this.pos_y.toFixed(2));
        template = template.replace("{radius}", this.radius.toFixed(2));
        template = template.replace("{line_width}", 0);
        template = template.replace("{fill}", this.background_filling ? "background" : "none");

        return template;
    }

    export_v5() {

    }

    export(kicad_version) {
        return kicad_version == 6 ? this.export_v6() : this.export_v5();
    }
}

export class KiSymbolArc {
    center_x = 0;
    center_y = 0;
    radius = 0;
    angle_start = 0.0;
    angle_end = 0.0;
    start_x = 0;
    start_y = 0;
    middle_x = 0;
    middle_y = 0;
    end_x = 0;
    end_y = 0;

    constructor(center_x, center_y, radius, angle_start, angle_end, start_x, start_y, middle_x, middle_y, end_x, end_y) {
        this.center_x = center_x;
        this.center_y = center_y;
        this.radius = radius;
        this.angle_start = angle_start;
        this.angle_end = angle_end;
        this.start_x = start_x;
        this.start_y = start_y;
        this.middle_x = middle_x;
        this.middle_y = middle_y;
        this.end_x = end_x;
        this.end_y = end_y;
    }

    export_v6() {
        let template = '(arc\r\n';
        template += "\t";
        template += '(start {start_x} {start_y})\r\n';
        template += "\t";
        template += '(mid {middle_x} {middle_y})\r\n';
        template += "\t";
        template += '(end {end_x} {end_y})\r\n';
        template += "\t";
        template += '(stroke (width {line_width}) (type default) (color 0 0 0 0))\r\n';
        template += "\t";
        template += '(fill (type {fill}))\r\n';
        template += ")";

        template = template.replace("{start_x}", this.start_x.toFixed(2));
        template = template.replace("{start_y}", this.start_y.toFixed(2));
        template = template.replace("{middle_x}", this.middle_x.toFixed(2));
        template = template.replace("{middle_y}", this.middle_y.toFixed(2));
        template = template.replace("{end_x}", this.end_x.toFixed(2));
        template = template.replace("{end_y}", this.end_y.toFixed(2));
        template = template.replace("{line_width}", 0);
        template = template.replace("{fill}", this.angle_start == this.angle_end ? "background" : "none");

        return template;
    }

    export_v5() {

    }

    export(kicad_version) {
        return kicad_version == 6 ? this.export_v6() : this.export_v5();
    }
}

export class KiSymbolPolygon {
    points = [];
    points_number = 0;
    is_closed = false;

    constructor(points = [], points_number = 0, is_closed = false) {
        this.points = points;
        this.points_number = points_number;
        this.is_closed = is_closed;
    }

    export_v6() {
        let template = '(polyline \r\n';
        template += '\t';
        template += '(pts \r\n';
        template += '\t\t';
        template += '{polyline_path}\r\n';
        template += '\t';
        template += ')\r\n';
        template += '\t';
        template += '(stroke (width {line_width}) (type default) (color 0 0 0 0))\r\n';
        template += '\t';
        template += '(fill (type {fill}))\r\n';
        template += ')';


        let __points =[];
        for ( let __point of this.points){
            __points.push("(xy " + __point[0].toFixed(2) + " " + __point[1].toFixed(2) + ")");
        }
        template = template.replace("{polyline_path}", __points.join("\r\n"));
        template = template.replace("{line_width}", 0);
        template = template.replace("{fill}", this.is_closed ? "background" : "none");

        return template
    }

    export_v5() {

    }

    export(kicad_version) {
        return kicad_version == 6 ? this.export_v6() : this.export_v5();
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

    constructor(info = {}, pins = [], rectangles = [], circles = [], arcs = [], polygons = [], beziers = []) {
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
            if (shapes?.length > 0) {
                sym_export_data[_field] = [];
                for (let sub_symbol of shapes) {
                    sym_export_data[_field].push(sub_symbol.export(kicad_version));
                }
            } else {
                if (shapes?.export != undefined) {
                    sym_export_data[_field] = shapes.export(kicad_version);
                }
            }

        }
        return sym_export_data;
    }

    export_v6() {
        let sym_export_data = this.export_handler(6);

        let template = '(symbol "{library_id}" \r\n';
        template += '\t';
        template += '(in_bom yes)\r\n';
        template += '\t';
        template += '(on_board  yes)\r\n';
        template += '\t';
        template += '{symbol_properties}\r\n';
        template += '\t';
        template += '(symbol "{library_id}_0_1"\r\n';
        template += '\t\t';
        template += '{graphic_items}\r\n';
        template += '\t\t';
        template += '{pins}\r\n';
        template += '\t';
        template += ')\r\n';
        template += ')';

        template = template.replace("{library_id}", sanitize_fields(this.info.name));
        template = template.replace("{library_id}", sanitize_fields(this.info.name));
        template = template.replace("{symbol_properties}", sym_export_data.info.join("\r\n"));

        let graphicItems = [];
        Object.keys(sym_export_data).forEach((key) => {
            if (key != "info" && key != "pins") {
                graphicItems.push(...sym_export_data[key]);
            }
        });

        template = template.replace("{graphic_items}", graphicItems.join("\r\n"));
        template = template.replace("{pins}", sym_export_data.pins.join("\r\n"));

        return template;
    }

    export_v5() {

    }

    export(kicad_version = 6) {
        let component_data = kicad_version == 6 ? this.export_v6() : this.export_v5();
        return component_data;
    }
}