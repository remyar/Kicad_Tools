import {
    EeSymbol,
    EeSymbolInfo,
    EeSymbolBbox,
    EeSymbolPinSettings,
    EeSymbolPinDot,
    EeSymbolPinName,
    EeSymbolPinPath,
    EeSymbolPinDotBis,
    EeSymbolPinClock,
    EeSymbolPin
} from "./parameters_easyeda";

export default class EasyedaSymbolImporter {

    input = {};
    output = {};
    
    easyeda_handlers = {
        "P": this.add_easyeda_pin,
        /*   "R": add_easyeda_rectangle,
           "E": add_easyeda_ellipse,
           "C": add_easyeda_circle,
           "A": add_easyeda_arc,
           "PL": add_easyeda_polyline,
           "PG": add_easyeda_polygon,
           "PT": add_easyeda_path,*/
        // "PI" : Pie, Elliptical arc seems to be not supported in Kicad
    }


    constructor(easyeda_cp_cad_data) {
        this.input = easyeda_cp_cad_data;
        this.output = this.extract_easyeda_data(easyeda_cp_cad_data, easyeda_cp_cad_data?.dataStr?.head?.c_para);
    }

    get_symbol(){
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
}