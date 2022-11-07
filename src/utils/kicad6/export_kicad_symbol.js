import { KiPinType, KiPinStyle, KiSymbolPin, KiSymbolInfo, KiSymbol, KiSymbolRectangle, KiSymbolCircle, KiSymbolArc, KiSymbolPolygon } from "./parameters_kicad_symbol";
import { compute_arc } from './export_kicad_footprint';
import { get_middle_arc_pos } from '../easyeda/helpers';

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

    convert_to_kicad(ee_symbol, kicad_version = 6) {
        let ki_info = new KiSymbolInfo(
            ee_symbol.info.name,
            ee_symbol.info.prefix,
            ee_symbol.info.package,
            ee_symbol.info.manufacturer,
            ee_symbol.info.datasheet,
            ee_symbol.info.lcsc_id,
            ee_symbol.info.jlc_id
        );

        ki_info.description = ee_symbol.info.description;
        
        let kicad_symbol = new KiSymbol(
            ki_info,
            this.convert_ee_pins(ee_symbol.pins, ee_symbol.bbox, kicad_version),
            this.convert_ee_rectangles(ee_symbol.rectangles, ee_symbol.bbox, kicad_version),
            this.convert_ee_circles(ee_symbol.circles, ee_symbol.bbox, kicad_version),
            this.convert_ee_arcs(ee_symbol.arcs, ee_symbol.bbox, kicad_version),
        )

        kicad_symbol.circles = [...kicad_symbol.circles, ...this.convert_ee_ellipses(ee_symbol.ellipses, ee_symbol.bbox, kicad_version)];
        let val = this.convert_ee_paths(ee_symbol.paths, ee_symbol.bbox, kicad_version);
        kicad_symbol.polygons = [...kicad_symbol.polygons, ...val.kicad_polygons];
        kicad_symbol.polygons = [...kicad_symbol.polygons, ...val.kicad_beziers];
        kicad_symbol.polygons = [...kicad_symbol.polygons, ...this.convert_ee_polylines(ee_symbol.polylines, ee_symbol.bbox, kicad_version)];
        kicad_symbol.polygons = [...kicad_symbol.polygons, ...this.convert_ee_polygons(ee_symbol.polygons, ee_symbol.bbox, kicad_version)];
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
                -to_ki(parseInt(ee_pin.settings.pos_y) - parseInt(ee_bbox.y))
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

    convert_ee_circles(ee_circles, ee_bbox, kicad_version = 6) {
        let to_ki = kicad_version == 5 ? this.px_to_mil : this.px_to_mm;
        let kicad_circles = [];
        for (let ee_circle of ee_circles) {
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

    convert_ee_arcs(ee_arcs, ee_bbox, kicad_version = 6) {
        let to_ki = kicad_version == 5 ? this.px_to_mil : this.px_to_mm;
        let kicad_arcs = [];
        for (let ee_arc of ee_arcs) {
            let ki_arc = new KiSymbolArc(
                0.0,
                0.0,
                to_ki(Math.max(ee_arc.path[1].radius_x, ee_arc.path[1].radius_y)),
                ee_arc.path[1].x_axis_rotation,
                0.0,
                to_ki(ee_arc.path[0].start_x - ee_bbox.x),
                to_ki(ee_arc.path[0].start_y - ee_bbox.y),
                0.0,
                0.0,
                to_ki(ee_arc.path[1].end_x - ee_bbox.x),
                to_ki(ee_arc.path[1].end_y - ee_bbox.y)
            );

            let r = compute_arc(
                ki_arc.start_x,
                ki_arc.start_y,
                to_ki(ee_arc.path[1].radius_x),
                to_ki(ee_arc.path[1].radius_y),
                ki_arc.angle_start,
                ee_arc.path[1].flag_large_arc,
                ee_arc.path[1].flag_sweep,
                ki_arc.end_x,
                ki_arc.end_y,
            )

            ki_arc.center_x = r.center_x;
            ki_arc.center_y = ee_arc.path[1].flag_large_arc ? r.center_y : -r.center_y;
            ki_arc.angle_end = ee_arc.path[1].flag_large_arc ? (360 - r.angle_end) : r.angle_end;

            let s = get_middle_arc_pos(
                ki_arc.center_x,
                ki_arc.center_y,
                ki_arc.radius,
                ki_arc.angle_start,
                ki_arc.angle_end,
            );

            ki_arc.middle_x = s.middle_x;
            ki_arc.middle_y = s.middle_y;

            ki_arc.start_y = ee_arc.path[1].flag_large_arc ? ki_arc.start_y : -ki_arc.start_y;
            ki_arc.end_y = ee_arc.path[1].flag_large_arc ? ki_arc.end_y : -ki_arc.end_y;

            kicad_arcs.push(ki_arc);
        }

        return kicad_arcs;
    }

    convert_ee_polylines(ee_polylines, ee_bbox, kicad_version = 6) {
        let to_ki = kicad_version == 5 ? this.px_to_mil : this.px_to_mm;
        let kicad_polygons = [];
        for (let ee_polyline of ee_polylines) {
            let raw_pts = ee_polyline.points?.split(" ") || [];
            let x_points = [];
            let y_points = [];
            for (let i = 0; i < raw_pts.length; i += 2) {
                x_points.push(to_ki(parseInt(parseFloat(raw_pts[i])) - parseInt(ee_bbox.x)));
                y_points.push(-to_ki(parseInt(parseFloat(raw_pts[i + 1])) - parseInt(ee_bbox.y)));
            }

            if ((typeof ee_polyline == "EeSymbolPolygon") || ee_polyline.fill_color) {
                x_points.push(x_points[0]);
                y_points.push(y_points[0]);
            }

            let points = [];
            for (let i = 0; i < Math.min(x_points.length, y_points.length); i++) {
                points.push([x_points[i], y_points[i]]);
            }
            let kicad_polygon = new KiSymbolPolygon(
                points,
                Math.min(x_points.length, y_points.length),
                ((x_points[0] == x_points[-1]) && (y_points[0] == y_points[-1])) ? true : false
            )

            kicad_polygons.push(kicad_polygon);
        }
        return kicad_polygons;
    }

    convert_ee_ellipses(ee_ellipses, ee_bbox, kicad_version = 6) {
        let to_ki = kicad_version == 5 ? this.px_to_mil : this.px_to_mm;
        let kicad_circles = [];
        for (let ee_ellipse of ee_ellipses) {
            if (ee_ellipses.radius_x == ee_ellipses.radius_y) {
                let ki_ellipse = new KiSymbolCircle(
                    to_ki(parseInt(ee_ellipse.center_x) - parseInt(ee_bbox.x)),
                    -to_ki(parseInt(ee_ellipse.center_y) - parseInt(ee_bbox.y)),
                    to_ki(ee_ellipse.radius_x)
                );
                kicad_circles.push(ki_ellipse);
            }
        }
        return kicad_circles;
    }

    convert_ee_polygons(ee_polygons , ee_bbox , kicad_version = 6){
        return this.convert_ee_polylines(ee_polygons , ee_bbox , kicad_version);
    }

    convert_ee_paths(ee_paths , ee_bbox , kicad_version = 6){
        let kicad_polygons = [];
        let kicad_beziers = [];

        let to_ki = kicad_version == 5 ? this.px_to_mil : this.px_to_mm;
        for (let ee_path of ee_paths) {
            let raw_pts = ee_path.paths.split(" ")
        }

        return {
            kicad_polygons,
            kicad_beziers
        }
    }
}