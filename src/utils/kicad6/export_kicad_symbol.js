import { KiPinType, KiPinStyle, KiSymbolPin, KiSymbolInfo, KiSymbol, KiSymbolRectangle , KiSymbolCircle} from "./parameters_kicad_symbol";


const ee_pin_type_to_ki_pin_type = {
    unspecified: KiPinType.unspecified,
    _input: KiPinType._input,
    output: KiPinType.output,
    bidirectional: KiPinType.bidirectional,
    power: KiPinType.power_in,
}

export class ExporterSymbolKicad {
    input = {};
    version = 6;
    output = {};

    constructor(symbol, version = 6) {
        this.input = symbol;
        this.version = version;
        this.output = this.convert_to_kicad(this.input, this.kicad_version);
    }

    tune_footprint_ref_path(ki_symbol, is_project_relative, footprint_lib_name) {
        ki_symbol.info.package = "" + footprint_lib_name + ":" + ki_symbol.info.package;
        if (is_project_relative == true) {
            ki_symbol.info.package = "${KIPRJMOD}:" + ki_symbol.info.package;
        }
    }

    export(is_project_relative, footprint_lib_name = "") {
        this.tune_footprint_ref_path(this.output, is_project_relative, footprint_lib_name);
        return this.output.export(this.version)
    }

    px_to_mil(dim) {
        return 10.0 * dim;
    }

    px_to_mm(dim) {
        return 10.0 * dim * 0.0254;
    }

    convert_to_kicad(ee_symbol, kicad_version) {
        let ki_info = new KiSymbolInfo(
            ee_symbol.info.name,
            ee_symbol.info.prefix,
            ee_symbol.info.package,
            ee_symbol.info.manufacturer,
            ee_symbol.info.datasheet,
            ee_symbol.info.lcsc_id,
            ee_symbol.info.jlc_id
        );

        let kicad_symbol = new KiSymbol(
            ki_info,
            this.convert_ee_pins(ee_symbol.pins, ee_symbol.bbox, kicad_version),
            this.convert_ee_rectangles(ee_symbol.rectangles, ee_symbol.bbox, kicad_version),
            this.convert_ee_circles(ee_symbol.circles , ee_symbol.bbox, kicad_version),
        )


        return kicad_symbol;
    }

    convert_ee_pins(ee_pins, ee_bbox, kicad_version = 6) {
        let to_ki = kicad_version == 5 ? this.px_to_mil : this.px_to_mm;
        let pin_spacing = kicad_version == 5 ? 100 : 2.54;

        let kicad_pins = [];
        for (let ee_pin of ee_pins) {
            let ki_pin = new KiSymbolPin(
                ee_pin.name.text.replace(" ", ""),
                ee_pin.settings.spice_pin_number.replace(" ", ""),
                KiPinStyle.line,
                ee_pin.settings.type,
                ee_pin.settings.rotation,
                to_ki(parseInt(ee_pin.settings.pos_x) - parseInt(ee_bbox.x)),
                to_ki(parseInt(ee_pin.settings.pos_y) - parseInt(ee_bbox.y))
            );

            if ((ee_pin.dot.is_displayed == true) && (ee_pin.clock.is_displayed == true)) {
                ki_pin.style = KiPinStyle.inverted_clock;
            } else if (ee_pin.dot.is_displayed == true) {
                ki_pin.style = KiPinStyle.inverted;
            } else if (ee_pin.clock.is_displayed == true) {
                ki_pin.style = KiPinStyle.clock;
            }

            let pin_length = Math.abs(parseInt(parseFloat(ee_pin.pin_path.path.split("h")[ee_pin.pin_path.path.split("h").length - 1])));
            // Deal with different pin length
            if (ee_pin.settings.rotation == 0) {
                ki_pin.pos_x -= to_ki(pin_length) - pin_spacing;
            }
            else if (ee_pin.settings.rotation == 180) {
                ki_pin.pos_x += to_ki(pin_length) - pin_spacing;
            }
            else if (ee_pin.settings.rotation == 90) {
                ki_pin.pos_y -= to_ki(pin_length) - pin_spacing;
            }
            else if (ee_pin.settings.rotation == 270) {
                ki_pin.pos_y += to_ki(pin_length) - pin_spacing;
            }

            kicad_pins.push(ki_pin)
        }

        return kicad_pins;
    }

    convert_ee_rectangles(ee_rectangles, ee_bbox, kicad_version = 6) {
        let to_ki = kicad_version == 5 ? this.px_to_mil : this.px_to_mm;
        let kicad_rectangles = [];
        for (let ee_rectangle of ee_rectangles) {
            let ki_rectangle = new KiSymbolRectangle(
                to_ki(parseInt(ee_rectangle.pos_x) - parseInt(ee_bbox.x)),
                -to_ki(parseInt(ee_rectangle.pos_y) - parseInt(ee_bbox.y))
            );

            ki_rectangle.pos_x1 = to_ki(parseInt(ee_rectangle.width)) + ki_rectangle.pos_x0;
            ki_rectangle.pos_y1 = -to_ki(parseInt(ee_rectangle.height)) + ki_rectangle.pos_y0;

            kicad_rectangles.push(ki_rectangle);
        }
        return kicad_rectangles;
    }

    convert_ee_circles(ee_circles , ee_bbox , kicad_version = 6){
        let to_ki = kicad_version == 5 ? this.px_to_mil : this.px_to_mm;
        let kicad_circles = [];
        for (let ee_circle  of ee_circles) {
            let ki_circle = new KiSymbolCircle(
                to_ki(parseInt(ee_circle.center_x) - parseInt(ee_bbox.x)),
                -to_ki(parseInt(ee_circle.center_y) - parseInt(ee_bbox.y)),
                to_ki(ee_circle.radius),
                ee_circle.fill_color
            );
            kicad_circles.push(ki_circle);
        }
        return kicad_circles;
    }
}