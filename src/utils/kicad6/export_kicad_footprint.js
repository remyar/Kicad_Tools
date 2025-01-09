import {
    KI_PAD_SHAPE,
    KI_PAD_LAYER,
    KI_LAYERS,
    KiFootprintInfo,
    Ki3dModel,
    Ki3dModelBase,
    KiFootprint,
    KiFootprintPad,
    KiFootprintTrack,
    KiFootprintHole,
    KiFootprintCircle,
    KiFootprintRectangle,
    KiFootprintText,
    KiFootprintArc
} from "./parameters_kicad_footprint";


function to_radians(n) {
    return (n / 180.0) * Math.PI
}

function to_degrees(n) {
    return (n / Math.PI) * 180.0
}

function drill_to_ki(hole_radius, hole_length, pad_height, pad_width) {
    if ((hole_radius > 0) && (hole_length != undefined) && (hole_length != "") && (hole_length != 0)) {
        let max_distance_hole = Math.max(hole_radius * 2, hole_length);
        let pos_0 = pad_height - max_distance_hole;
        let pos_90 = pad_width - max_distance_hole;
        let max_distance = Math.max(pos_0, pos_90);
        if (max_distance == pos_0) {
            return ("(drill oval " + (2 * hole_radius) + " " + hole_length + ")");
        } else {
            return ("(drill oval " + hole_length + " " + (2 * hole_radius) + ")");
        }
    }

    if (hole_radius > 0) {
        return "(drill " + (2 * hole_radius) + ")"
    }

    return '';
}

function angle_to_ki(rotation) {
    if ((isNaN(rotation) == false) && (rotation != undefined)) {
        if (rotation > 180) {
            return -(360 - rotation)
        } else {
            return rotation
        }
    } else {
        return "";
    }
}

function fp_to_ki(dim) {
    if ((dim != undefined) && (dim != "") && (isNaN(parseFloat(dim)) == false)) {
        return parseFloat((parseFloat(dim) * 10 * 0.0254).toFixed(2));
    }

    return dim;
}

function rotate(x, y, degrees) {
    let radians = (degrees / 180) * 2 * Math.PI;
    let new_x = x * Math.cos(radians) - y * Math.sin(radians);
    let new_y = x * Math.sin(radians) + y * Math.cos(radians);
    return { rx: new_x, ry: new_y };
}

export function compute_arc(start_x, start_y, radius_x, radius_y, angle, large_arc_flag, sweep_flag, end_x, end_y) {
    //-- Compute the half distance between the current and the final point
    let dx2 = (start_x - end_x) / 2.0;
    let dy2 = (start_y - end_y) / 2.0

    //-- Convert angle from degrees to radians
    angle = to_radians(angle % 360.0);
    let cos_angle = Math.cos(angle);
    let sin_angle = Math.sin(angle);

    //-- Step 1 : Compute (x1, y1)
    let x1 = cos_angle * dx2 + sin_angle * dy2;
    let y1 = -sin_angle * dx2 + cos_angle * dy2;

    //-- Ensure radii are large enough
    radius_x = Math.abs(radius_x);
    radius_y = Math.abs(radius_y);
    let Pradius_x = radius_x * radius_x;
    let Pradius_y = radius_y * radius_y;
    let Px1 = x1 * x1;
    let Py1 = y1 * y1;

    let radiiCheck = ((Pradius_x != 0) && (Pradius_y != 0)) ? ((Px1 / Pradius_x) + (Py1 / Pradius_y)) : 0;

    if (radiiCheck > 1) {
        radius_x = Math.sqrt(radiiCheck) * radius_x;
        radius_y = Math.sqrt(radiiCheck) * radius_y;
        Pradius_x = radius_x * radius_x
        Pradius_y = radius_y * radius_y
    }

    //-- Step 2 : Compute (cx1, cy1)
    let sign = (large_arc_flag == sweep_flag) ? -1 : 1;
    let sq = 0;
    if (((Pradius_x * Py1) + (Pradius_y * Px1)) > 0) {
        sq = ((Pradius_x * Pradius_y) - (Pradius_x * Py1) - (Pradius_y * Px1)) / (
            (Pradius_x * Py1) + (Pradius_y * Px1)
        )
    }
    sq = Math.max(sq, 0);
    let coef = sign * Math.sqrt(sq);
    let cx1 = coef * ((radius_x * y1) / radius_y);
    let cy1 = (radius_x != 0) ? coef * -((radius_y * x1) / radius_x) : 0;

    //-- Step 3 : Compute (cx, cy) from (cx1, cy1)
    let sx2 = (start_x + end_x) / 2.0;
    let sy2 = (start_y + end_y) / 2.0;
    //-- print(start_x, end_x)
    let cx = sx2 + (cos_angle * cx1 - sin_angle * cy1);
    let cy = sy2 + (sin_angle * cx1 + cos_angle * cy1);

    //-- Step 4 : Compute the angle_extent (dangle)
    let ux = (radius_x != 0) ? (x1 - cx1) / radius_x : 0;
    let uy = (radius_y != 0) ? (y1 - cy1) / radius_y : 0;
    let vx = (radius_x != 0) ? (-x1 - cx1) / radius_x : 0;
    let vy = (radius_y != 0) ? (y1 - cy1) / radius_y : 0;

    //-- Compute the angle extent
    let n = Math.sqrt((ux * ux + uy * uy) * (vx * vx + vy * vy));
    let p = ux * vx + uy * vy;

    sign = ((ux * vy - uy * vx) < 0) ? -1 : 1;

    let angle_extent = 360 + 359;
    if (n != 0) {
        angle_extent = (Math.abs(p / n) < 1) ? to_degrees(sign * Math.acos(p / n)) : (360 + 359);
    }

    if (!sweep_flag && (angle_extent > 0)) {
        angle_extent -= 360;
    } else if (sweep_flag && (angle_extent < 0)) {
        angle_extent += 360;
    }

    let angleExtent_sign = angle_extent < 0 ? 1 : -1;
    angle_extent = (Math.abs(angle_extent) % 360) * angleExtent_sign;

    return {
        center_x: cx,
        center_y: cy,
        angle_end: angle_extent
    }
}



export class ExporterFootprintKicad {
    input = {};
    version = 6;
    output = {};

    constructor(ee_footprint) {
        this.input = ee_footprint;
        this.generate_kicad_footprint();
    }

    generate_kicad_footprint() {
        //-- Convert dimension from easyeda to kicad
        this.input.bbox.convert_to_mm();

        this.input.pads.forEach((p, idx) => {
            this.input.pads[idx].convert_to_mm();
        });

        this.input.tracks.forEach((p, idx) => {
            this.input.tracks[idx].convert_to_mm();
        });

        this.input.holes.forEach((p, idx) => {
            this.input.holes[idx].convert_to_mm();
        });

        this.input.circles.forEach((p, idx) => {
            this.input.circles[idx].convert_to_mm();
        });

        this.input.rectangles.forEach((p, idx) => {
            this.input.rectangles[idx].convert_to_mm();
        });

        this.input.texts.forEach((p, idx) => {
            this.input.texts[idx].convert_to_mm();
        });

        let ki_info = new KiFootprintInfo(this.input.info.name, this.input.info.fp_type);
        let ki_3d_model_info = undefined;
        if (this.input.model_3d) {
            this.input.model_3d.convert_to_mm();

            console.log(this.input.bbox);
            ki_3d_model_info = new Ki3dModel({
                name: this.input.model_3d.name,
                translation: new Ki3dModelBase(
                    (this.input.model_3d.translation.x - this.input.bbox.x).toFixed(2),
                    -parseFloat((this.input.model_3d.translation.y - this.input.bbox.y).toFixed(2)),
                    -parseFloat((this.input.model_3d.translation.z).toFixed(2))
                ),
                rotation: new Ki3dModelBase(
                    (360 - this.input.model_3d.rotation.x) % 360,
                    (360 - this.input.model_3d.rotation.y) % 360,
                    (360 - this.input.model_3d.rotation.z) % 360
                ),
                raw_wrl: ""
            })
            console.log(ki_3d_model_info);
        }

        this.output = new KiFootprint({ info: ki_info, model_3d: ki_3d_model_info });

        //-- for pads
        for (let ee_pad of this.input.pads) {
            let ki_pad = new KiFootprintPad({
                type: (ee_pad.hole_radius > 0) ? "thru_hole" : "smd",
                shape: KI_PAD_SHAPE[ee_pad.shape] != undefined ? KI_PAD_SHAPE[ee_pad.shape] : "custom",
                pos_x: ee_pad.center_x - this.input.bbox.x,
                pos_y: ee_pad.center_y - this.input.bbox.y,
                width: Math.max(ee_pad.width, 0.01),
                height: Math.max(ee_pad.height, 0.01),
                layers: KI_PAD_LAYER[ee_pad.layer_id] != undefined ? KI_PAD_LAYER[ee_pad.layer_id] : "",
                number: ee_pad.number,
                drill: 0.0,
                orientation: angle_to_ki(ee_pad.rotation),
                polygon: ""
            });

            ki_pad.drill = drill_to_ki(ee_pad.hole_radius, ee_pad.hole_length, ki_pad.height, ki_pad.width);

            if (ki_pad.number.includes("(") && ki_pad.number.includes(")")) {
                ki_pad.number = ki_pad.number.split("(")[1].split(")")[0];
            }

            //-- For custom polygon
            let is_custom_shape = (ki_pad.shape == "custom") ? true : false;
            let point_list = ee_pad.points.split(" ").map((point) => { return fp_to_ki(point); });
            if (is_custom_shape == true) {
                if (point_list.length <= 0) {
                    console.warn("PAD " + ee_pad.id + " is a polygon, but has no points defined");
                } else {
                    //-- Replace pad width & height since kicad doesn't care
                    ki_pad.width = 1.0
                    ki_pad.height = 1.0

                    //-- Generate polygon
                    let path = "";
                    for (let i = 0; i < point_list.length; i += 2) {
                        path += "(xy "
                        path += (point_list[i] - this.input.bbox.x).toFixed(2);
                        path += " ";
                        path += (point_list[i + 1] - this.input.bbox.y).toFixed(2);
                        path += ")";
                    }

                    ki_pad.polygon = "\n\t\t(primitives \n\t\t\t(gr_poly \n\t\t\t\t(pts " + path + "\n\t\t\t\t) \n\t\t\t\t(width 0.1) \n\t\t\t)\n\t\t)\n\t"
                }
            }

            this.output.pads.push(ki_pad);
        }

        //-- For tracks
        for (let ee_track of this.input.tracks) {
            let ki_track = new KiFootprintTrack(
                KI_PAD_LAYER[ee_track.layer_id] ? KI_PAD_LAYER[ee_track.layer_id] : "F.Fab",
                Math.max(ee_track.stroke_width, 0.01)
            );

            //-- Generate line
            let point_list = ee_track.points.split(" ").map((point) => { return fp_to_ki(point) });
            for (let i = 0; i < (point_list.length - 2); i += 2) {
                ki_track.points_start_x.push(parseFloat((point_list[i] - this.input.bbox.x).toFixed(2)));
                ki_track.points_start_y.push(parseFloat((point_list[i + 1] - this.input.bbox.y).toFixed(2)));
                ki_track.points_end_x.push(parseFloat((point_list[i + 2] - this.input.bbox.x).toFixed(2)));
                ki_track.points_end_y.push(parseFloat((point_list[i + 3] - this.input.bbox.y).toFixed(2)));
            }


            this.output.tracks.push(ki_track);
        }

        //-- For holes
        for (let ee_hole of this.input.holes) {
            let ki_hole = new KiFootprintHole(
                ee_hole.center_x - this.input.bbox.x,
                ee_hole.center_y - this.input.bbox.y,
                ee_hole.radius * 2
            );

            this.output.holes.push(ki_hole);
        }

        //-- For circles
        for (let ee_circle of this.input.circles) {
            let ki_circle = new KiFootprintCircle(
                ee_circle.cx - this.input.bbox.x,
                ee_circle.cy - this.input.bbox.y,
                0.0,
                0.0,
                KI_LAYERS[ee_circle.layer_id] != undefined ? KI_LAYERS[ee_circle.layer_id] : "F.Fab",
                Math.max(ee_circle.stroke_width, 0.01)
            );

            ki_circle.end_x = ki_circle.cx + ee_circle.radius;
            ki_circle.end_y = ki_circle.cy;
            this.output.circles.push(ki_circle);
        }

        //-- For rectangles
        for (let ee_rectangle of this.input.rectangles) {
            let ki_rectangle = KiFootprintRectangle(
            );

            let start_x = ee_rectangle.x - this.input.bbox.x;
            let start_y = ee_rectangle.y - this.input.bbox.y;
            let width = ee_rectangle.width;
            let height = ee_rectangle.height;

            ki_rectangle.points_start_x = [
                start_x,
                start_x + width,
                start_x + width,
                start_x,
            ]
            ki_rectangle.points_start_y = [start_y, start_y, start_y + height, start_y]
            ki_rectangle.points_end_x = [
                start_x + width,
                start_x + width,
                start_x,
                start_x,
            ]
            ki_rectangle.points_end_y = [
                start_y,
                start_y + height,
                start_y + height,
                start_y,
            ]

            this.output.rectangles.push(ki_rectangle);
        }

        //-- For arcs
        for (let ee_arc of this.input.arcs) {
            let arc_path = ee_arc.path.replace(/\,/gi, " ").replace("M ", "M").replace("A ", "A");

            let start_x = arc_path.split("A")[0].replace("M", "").split(" ")[0];
            let start_y = arc_path.split("A")[0].replace("M", "").split(" ")[1];

            start_x = fp_to_ki(start_x) - this.input.bbox.x;
            start_y = fp_to_ki(start_y) - this.input.bbox.y;

            let arc_parameters = arc_path.split("A")[1].replace("  ", " ");
            let svg_rx = arc_parameters.split(" ")[0];
            let svg_ry = arc_parameters.split(" ")[1];
            let x_axis_rotation = arc_parameters.split(" ")[2];
            let large_arc = arc_parameters.split(" ")[3];
            let sweep = arc_parameters.split(" ")[4];
            let end_x = arc_parameters.split(" ")[5];
            let end_y = arc_parameters.split(" ")[6];

            let _r = rotate(fp_to_ki(svg_rx), fp_to_ki(svg_ry), 0);
            let rx = _r.rx;
            let ry = _r.ry;

            end_x = fp_to_ki(end_x) - this.input.bbox.x;
            end_y = fp_to_ki(end_y) - this.input.bbox.y;

            let cx = 0.0;
            let cy = 0.0;
            let extent = 0.0;
            if (ry != 0) {
                let ca = compute_arc(
                    start_x,
                    start_y,
                    rx,
                    ry,
                    parseFloat(x_axis_rotation),
                    large_arc == "1" ? true : false,
                    sweep == "1" ? true : false,
                    end_x,
                    end_y,
                );

                cx = ca.center_x;
                cy = ca.center_y;
                extent = ca.angle_end;
            }

            let ki_arc = new KiFootprintArc(
                cx,
                cy,
                end_x,
                end_y,
                extent,
                KI_LAYERS[ee_arc.layer_id] != undefined ? KI_LAYERS[ee_arc.layer_id] : "F.Fab",
                Math.max(fp_to_ki(ee_arc.stroke_width), 0.01)
            );
            this.output.arcs.push(ki_arc);
        }

        //-- For texts
        for (let ee_text of this.input.texts) {
            let ki_text = new KiFootprintText(
                ee_text.center_x - this.input.bbox.x,
                ee_text.center_y - this.input.bbox.y,
                angle_to_ki(ee_text.rotation),
                ee_text.text,
                KI_LAYERS[ee_text.layer_id] != undefined ? KI_LAYERS[ee_text.layer_id] : "F.Fab",
                Math.max(ee_text.font_size, 1),
                Math.max(ee_text.stroke_width, 0.01),
                ee_text.is_displayed ? "" : "hide",
                ""
            );

            ki_text.layers = (ee_text.type == "N") ? ki_text.layers.replace(".SilkS", ".Fab") : ki_text.layers;
            ki_text.mirror = (ki_text.layers[0] == "B") ? " mirror" : "";

            this.output.texts.push(ki_text);
        }
    }

    export(is_project_relative, librarieName) {
        let ki = this.output;
        let ki_lib = "";

        ki_lib += "(module " + librarieName + ":" + ki.info.name + " (layer F.Cu) (tedit 5DC5F6A4)\r\n";

        if ((ki.info.fp_type != undefined) && (ki.info.fp_type == "smd")) {
            ki_lib += "\t(attr " + ki.info.fp_type + ")\n";
        }

        //-- Get y_min and y_max to put component info
        let y_low = Number.MAX_VALUE;
        let y_high = Number.MIN_VALUE;

        ki.pads.forEach((pad) => {
            y_low = Math.min(pad.pos_y, y_low);
            y_high = Math.max(pad.pos_y, y_high);
        })

        ki_lib += "\t(fp_text reference REF** (at 0 " + (y_low - 4) + ") (layer F.SilkS)\n\t\t(effects (font (size 1 1) (thickness 0.15)))\n\t)\n"
        ki_lib += "\t(fp_text value " + ki.info.name + " (at 0 " + (y_high + 4) + ") (layer F.Fab)\n\t\t(effects (font (size 1 1) (thickness 0.15)))\n\t)\n"

        ki_lib += "\t(fp_text user %R (at 0 0) (layer F.Fab)\n\t\t(effects (font (size 1 1) (thickness 0.15)))\n\t)\n"

        for (let track of [...ki.tracks, ...ki.rectangles]) {
            for (let i = 0; i < track.points_start_x.length; i++) {
                ki_lib += "\t(fp_line (start " + track.points_start_x[i].toFixed(2) + " " + track.points_start_y[i].toFixed(2) + ") (end " + track.points_end_x[i].toFixed(2) + " " + track.points_end_y[i].toFixed(2) + ")";
                ki_lib += " (layer " + track.layers + ") (width " + track.stroke_width.toFixed(2) + "))\n";
            }
        }

        for (let pad of ki.pads) {
            ki_lib += "\t(pad " + pad.number + " " + pad.type + " " + pad.shape + " ";
            ki_lib += "(at " + pad.pos_x.toFixed(2) + " " + pad.pos_y.toFixed(2) + " " + pad.orientation.toFixed(2) + ") ";
            ki_lib += "(size " + pad.width.toFixed(2) + " " + pad.height.toFixed(2) + ") (layers " + pad.layers + ")" + pad.drill + "" + pad.polygon + ")\n";
        }

        for (let hole of ki.holes) {
            ki_lib += '\t(pad "" thru_hole circle (at ' + hole.pos_x.toFixed(2) + ' ' + hole.pos_y.toFixed(2) + ') (size ' + hole.size.toFixed(2);
            ki_lib += " " + hole.size.toFixed(2) + ") (drill " + hole.size.toFixed(2) + ") (layers *.Cu *.Mask))\n";
        }

        for (let circle of ki.circles) {
            ki_lib += "\t(fp_circle (center " + circle.cx.toFixed(2) + " " + circle.cy.toFixed(2) + ") (end " + circle.end_x.toFixed(2) + " " + circle.end_y.toFixed(2) + ") (layer";
            ki_lib += " " + circle.layers + ") (width " + circle.stroke_width.toFixed(2) + "))\n";
        }

        for (let arc of ki.arcs) {
            ki_lib += "\t(fp_arc (start " + arc.start_x.toFixed(2) + " " + arc.start_y.toFixed(2) + ") (end " + arc.end_x.toFixed(2) + " " + arc.end_y.toFixed(2) + ") (angle"
            ki_lib += " " + arc.angle.toFixed(2) + ") (layer " + arc.layers + ") (width " + arc.stroke_width.toFixed(2) + "))\n";
        }

        for (let text of ki.texts) {
            ki_lib += "\t(fp_text user " + text.text + " (at " + text.pos_x.toFixed(2) + " " + text.pos_y.toFixed(2) + " " + text.orientation.toFixed(2) + ") (layer";
            ki_lib += " " + text.layers + ")" + text.display + "\n\t\t(effects (font (size " + text.font_size.toFixed(2) + " " + text.font_size.toFixed(2) + ")";
            ki_lib += " (thickness " + text.thickness.toFixed(2) + ")) (justify left" + text.mirror + "))\n\t)\n";
        }

        if (ki.model_3d != undefined && ki.model_3d != "") {
            let model_3d_path = "${KIPRJMOD}/" + librarieName + ".3dshapes/" + ki.model_3d.name + ".wrl";

            ki_lib += '\t(model "' + model_3d_path + '"\n\t\t(offset (xyz ' + ki.model_3d.translation.x.toFixed(3) + ' ' + ki.model_3d.translation.y.toFixed(3) + '';
            ki_lib += " " + ki.model_3d.translation.z.toFixed(3) + "))\n\t\t(scale (xyz 1 1 1))\n\t\t(rotate (xyz " + ki.model_3d.rotation.x.toFixed(3) + " " + ki.model_3d.rotation.y.toFixed(3) + "";
            ki_lib += " " + ki.model_3d.rotation.x.toFixed(3) + "))\n\t)\n";
        }
        ki_lib += ")";
        return ki_lib;
    }
}