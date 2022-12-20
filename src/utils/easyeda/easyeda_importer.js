import {
    ee_footprint,
    EeSymbol,
    EeSymbolInfo,
    EeSymbolBbox,
    EeSymbolPinSettings,
    EeSymbolPinDot,
    EeSymbolPinName,
    EeSymbolPinPath,
    EeSymbolPinDotBis,
    EeSymbolPinClock,
    EeSymbolPin,
    EeSymbolRectangle,
    EeSymbolArc,
    EeSymbolPolyline,
    EeSymbolPolygon,
    EeSymbolEllipse,
    EeSymbolCircle,
    EeSymbolPath,
    EeFootprintInfo,
    EeFootprintBbox,
    EeFootprintCircle,
    EeFootprintTrack,
    EeFootprintPad,
    EeFootprintHole,
    EeFootprintArc,
    EeFootprintRectangle,
    EeFootprintText,
    Ee3dModel,
    Ee3dModelBase
} from "./parameters_easyeda";

export class EasyedaSymbolImporter {

    input = {};
    output = {};

    easyeda_handlers = {
        "P": this.add_easyeda_pin,
        "R": this.add_easyeda_rectangle,
        "E": this.add_easyeda_ellipse,
        "C": this.add_easyeda_circle,
        "A": this.add_easyeda_arc,
        "PL": this.add_easyeda_polyline,
        "PG": this.add_easyeda_polygon,
        "PT": this.add_easyeda_path,
        // "PI" : Pie, Elliptical arc seems to be not supported in Kicad
    }


    constructor(easyeda_cp_cad_data) {
        this.input = easyeda_cp_cad_data;
        this.output = this.extract_easyeda_data(easyeda_cp_cad_data, easyeda_cp_cad_data?.dataStr?.head?.c_para);
    }

    get_symbol() {
        return this.output;
    }

    extract_easyeda_data(ee_data, ee_data_info) {
        let new_ee_symbol = new EeSymbol({
            info: new EeSymbolInfo(
                ee_data_info.name,
                ee_data_info.pre,
                ee_data_info.package || "",
                ee_data_info.BOM_Manufacturer || "",
                ee_data.lcsc?.url || "",
                ee_data.lcsc?.number || "",
                ee_data_info["BOM_JLCPCB Part Class"] || ""
            ),
            bbox: new EeSymbolBbox(
                ee_data.dataStr.head.x,
                ee_data.dataStr.head.y
            )
        })

        for (let line of ee_data.dataStr.shape) {
            let designator = line.split("~")[0];
            if (this.easyeda_handlers[designator] != undefined) {
                this.easyeda_handlers[designator](line, new_ee_symbol);
            } else {
                console.warn("Unknow symbol designator : " + designator);
            }
        }

        return new_ee_symbol;
    }

    add_easyeda_pin(pin_data, ee_symbol) {
        let segments = pin_data.split("^^");
        let ee_segments = [];
        for (let seg of segments) {
            ee_segments.push(seg.split("~"));
        }

        let pin_settings = new EeSymbolPinSettings(ee_segments[0].slice(1));
        let pin_dot = new EeSymbolPinDot(parseFloat(ee_segments[1][0]), parseFloat(ee_segments[1][1]));
        let pin_path = new EeSymbolPinPath(ee_segments[2][0], ee_segments[2][1]);
        let pin_name = new EeSymbolPinName(ee_segments[3]);
        let pin_dot_bis = new EeSymbolPinDotBis(
            ee_segments[5][0],
            parseFloat(ee_segments[5][1]),
            parseFloat(ee_segments[5][2]),
        );
        let pin_clock = new EeSymbolPinClock(ee_segments[6][0], ee_segments[6][1]);

        ee_symbol.pins.push(
            new EeSymbolPin(pin_settings, pin_dot, pin_path, pin_name, pin_dot_bis, pin_clock)
        );
    }

    add_easyeda_rectangle(rectangle_data, ee_symbol) {
        let _obj = rectangle_data.split("~").slice(1);
        let obj = new EeSymbolRectangle(
            _obj[0],
            _obj[1],
            _obj[2],
            _obj[3],
            _obj[4],
            _obj[5],
            _obj[6],
            _obj[7],
            _obj[8],
            _obj[9],
            _obj[10],
            _obj[11],
            _obj[12],
        );
        ee_symbol.rectangles.push(obj);
    }

    add_easyeda_ellipse(ellipse_data, ee_symbol) {
        let _obj = ellipse_data.split("~").slice(1);
        let obj = new EeSymbolEllipse(
            _obj[0],
            _obj[1],
            _obj[2],
            _obj[3],
            _obj[4],
            _obj[5],
            _obj[6],
            _obj[7],
            _obj[8],
            _obj[9]
        );
        ee_symbol.ellipses.push(obj);
    }

    add_easyeda_circle(circle_data, ee_symbol) {
        let _obj = circle_data.split("~").slice(1);
        let obj = new EeSymbolCircle(
            _obj[0],
            _obj[1],
            _obj[2],
            _obj[3],
            _obj[4],
            _obj[5],
            _obj[6],
            _obj[7],
            _obj[8]
        );
        ee_symbol.circles.push(obj);
    }

    add_easyeda_arc(arc_data, ee_symbol) {
        let _obj = arc_data.split("~").slice(1);
        let obj = new EeSymbolArc(
            _obj[0],
            _obj[1],
            _obj[2],
            _obj[3],
            _obj[4],
            _obj[5],
            _obj[6],
            _obj[7]
        );
        ee_symbol.arcs.push(obj);
    }

    add_easyeda_polyline(polyline_data, ee_symbol) {
        let _obj = polyline_data.split("~").slice(1);
        let obj = new EeSymbolPolyline(
            _obj[0],
            _obj[1],
            _obj[2],
            _obj[3],
            _obj[4],
            _obj[5],
            _obj[6]
        );
        ee_symbol.polylines.push(obj);
    }

    add_easyeda_polygon(polygon_data, ee_symbol) {
        let _obj = polygon_data.split("~").slice(1);
        let obj = new EeSymbolPolygon(            
            _obj[0],
            _obj[1],
            _obj[2],
            _obj[3],
            _obj[4],
            _obj[5],
            _obj[6]);
        ee_symbol.polygons.push(obj);
    }

    add_easyeda_path(path_data, ee_symbol) {
        let _obj = path_data.split("~").slice(1);
        let obj = new EeSymbolPath(
            _obj[0],
            _obj[1],
            _obj[2],
            _obj[3],
            _obj[4],
            _obj[5],
            _obj[6]
        );
        ee_symbol.paths.push(obj);
    }
}

export class EasyedaFootprintImporter {
    input = {};
    output = {};

    constructor(easyeda_cp_cad_data) {
        this.input = easyeda_cp_cad_data;
        this.output = this.extract_easyeda_data(easyeda_cp_cad_data?.packageDetail?.dataStr, easyeda_cp_cad_data?.packageDetail?.dataStr?.head?.c_para);
    }

    get_footprint() {
        return this.output;
    }

    extract_easyeda_data(ee_data_str, ee_data_info) {
        let new_ee_footprint = new ee_footprint({
            info: new EeFootprintInfo(
                ee_data_info["package"],
                "smd",
                ee_data_info["3DModel"]
            ),
            bbox: new EeFootprintBbox(
                parseFloat(ee_data_str.head.x),
                parseFloat(ee_data_str.head.y)
            ),
            model_3d: ""
        });

        for (let line of ee_data_str.shape) {
            let ee_designator = line.split("~")[0];
            let ee_fields = line.split("~").slice(1);

            switch (ee_designator) {
                case "PAD": {
                    let ee_pad = new EeFootprintPad(
                        ee_fields[0],
                        ee_fields[1],
                        ee_fields[2],
                        ee_fields[3],
                        ee_fields[4],
                        ee_fields[5],
                        ee_fields[6],
                        ee_fields[7],
                        ee_fields[8],
                        ee_fields[9],
                        ee_fields[10],
                        ee_fields[11],
                        ee_fields[12],
                        ee_fields[13],
                        ee_fields[14],
                        ee_fields[15],
                        ee_fields[16],
                        ee_fields[17],
                        ee_fields[18]
                    );
                    new_ee_footprint.pads.push(ee_pad);
                    break;
                }
                case "TRACK": {
                    let ee_track = new EeFootprintTrack(
                        ee_fields[0],
                        ee_fields[1],
                        ee_fields[2],
                        ee_fields[3],
                        ee_fields[4],
                        ee_fields[5]
                    );
                    new_ee_footprint.tracks.push(ee_track);
                    break;
                }
                case "HOLE": {
                    let ee_hole = new EeFootprintHole(

                    );
                    new_ee_footprint.holes.push(ee_hole);
                    break;
                }
                case "CIRCLE": {
                    let ee_circle = new EeFootprintCircle(
                        ee_fields[0],
                        ee_fields[1],
                        ee_fields[2],
                        ee_fields[3],
                        ee_fields[4],
                        ee_fields[5],
                        ee_fields[6],
                        ee_fields[7],
                        ee_fields[8]
                    );
                    new_ee_footprint.circles.push(ee_circle);
                    break;
                }
                case "ARC": {
                    let ee_arc = new EeFootprintArc(
                        ee_fields[0],
                        ee_fields[1],
                        ee_fields[2],
                        ee_fields[3],
                        ee_fields[4],
                        ee_fields[5],
                        ee_fields[6]
                    );
                    new_ee_footprint.arcs.push(ee_arc);
                    break;
                }
                case "RECT": {
                    let ee_rectangle = new EeFootprintRectangle(
                        ee_fields[0],
                        ee_fields[1],
                        ee_fields[2],
                        ee_fields[3],
                        ee_fields[4],
                        ee_fields[5],
                        ee_fields[6],
                        ee_fields[7]
                    );
                    new_ee_footprint.rectangles.push(ee_rectangle)
                    break;
                }
                case "TEXT": {
                    let ee_text = new EeFootprintText(
                        ee_fields[0],
                        ee_fields[1],
                        ee_fields[2],
                        ee_fields[3],
                        ee_fields[4],
                        ee_fields[5],
                        ee_fields[6],
                        ee_fields[7],
                        ee_fields[8],
                        ee_fields[9],
                        ee_fields[10],
                        ee_fields[11],
                        ee_fields[12],
                        ee_fields[13]
                    );
                    new_ee_footprint.texts.push(ee_text);
                    break;
                }
                case "SVGNODE": {
                    new_ee_footprint.model_3d = new Easyeda3dModelImporter(
                        line,
                        false
                    ).output;
                    break;
                }
                case "SOLIDREGION": {
                    break;
                }
            }
        }

        return new_ee_footprint;
    }
}

export class Easyeda3dModelImporter {
    input = "";
    download_raw_3d_model = false;
    output = {};

    constructor(easyeda_cp_cad_data, download_raw_3d_model = false) {
        this.input = easyeda_cp_cad_data;
        this.download_raw_3d_model = download_raw_3d_model;
        this.output = this.create_3d_model();
    }

    create_3d_model() {
        let ee_data = (typeof this.input == " object") ? this.input?.packageDetail?.dataStr?.shape : this.input;

        let model_3d_info = this.get_3d_model_info(ee_data);
        if (model_3d_info != undefined) {
            let model_3d = this.parse_3d_model_info(model_3d_info);
            return model_3d;
        } else {
            console.log("No 3D model available for this component");
            return undefined;
        }
    }

    get_3d_model_info(ee_data) {
        let ee_designator = ee_data.split("~")[0];
        if (ee_designator == "SVGNODE") {
            return JSON.parse(ee_data.split("~").slice(1)[0]).attrs;
        }
        else {
            return undefined;
        }
    }

    parse_3d_model_info(info) {
        return new Ee3dModel(
            info.title,
            info.uuid,
            new Ee3dModelBase(info["c_origin"].split(",")[0], info["c_origin"].split(",")[1], info["z"]),
            new Ee3dModelBase(info["c_rotation"].split(",")[0], info["c_rotation"].split(",")[1], info["c_rotation"].split(",")[2])
        );
    }

}

