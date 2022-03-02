import ArcSegmenter from './ArcSegmenter ';

export default async (svg) => {
    function GetLayerString(layerId){
        switch (layerId) {
            case 1: {
                let _str = "F.Cu ";
                _str += "F.Paste ";
                _str += "F.Mask ";
                return _str;
            }
            case 3: {
                return "F.SilkS";
            }
            case 11: {
                let _str = "";
                _str += "*.Cu ";
                _str += "*.Mask ";
                return _str;
            }
            case 12 : {
                return "undefined";
            }
            default :{
                break;
            }
        }
    }
    return new Promise(async (resolve, reject) => {
        let Tab2 = [];
        let config = {
            offsetX: parseFloat(svg.properties.c_origin.split(',')[0]).toFixed(2),
            offsetY: parseFloat(svg.properties.c_origin.split(',')[1]).toFixed(2),
            factor: 3.9376470588235294117647058823529
        }
        svg.children.forEach(element => {
            switch (element.tagName) {
                case 'circle': {
                    if (element.properties && element.properties.c_shapetype) {
                        switch (element.properties.c_shapetype) {
                            case 'line': {
                                let _str = "(fp_circle ";
                                _str += "(center ";
                                _str += ((config.offsetX - element.properties.cx) / -config.factor).toFixed(2);
                                _str += " ";
                                _str += ((config.offsetY - element.properties.cy) / -config.factor).toFixed(2);
                                _str += ") ";
                                _str += "(end ";
                                _str += (((config.offsetX - element.properties.cx) - element.properties.r) / -config.factor).toFixed(2);
                                _str += " ";
                                _str += ((config.offsetY - element.properties.cy) / -config.factor).toFixed(2);
                                _str += ")";
                                _str += "(layer ";
                                _str += GetLayerString(element.properties.layerid);
                                _str += ") ";
                                _str += "(width ";
                                _str += (parseFloat(element.properties["stroke-width"]) / config.factor).toFixed(2);
                                _str += ")";
                                _str += ")";
                                Tab2.push(_str);
                                break;
                            }
                        }
                    }
                    break;
                }
                case 'rect': {
                    if (element.properties && element.properties.c_shapetype) {
                        switch (element.properties.c_shapetype) {
                            case 'line': {
                                let points = [];

                                points.push({
                                    x: element.properties.x,
                                    y: element.properties.y,
                                });
                                points.push({
                                    x: element.properties.x + element.properties.width,
                                    y: element.properties.y,
                                });
                                points.push({
                                    x: element.properties.x + element.properties.width,
                                    y: element.properties.y + element.properties.height,
                                });
                                points.push({
                                    x: element.properties.x,
                                    y: element.properties.y + element.properties.height,
                                });
                                points.push({
                                    x: element.properties.x,
                                    y: element.properties.y,
                                });

                                let offset = 0;
                                let p1 = points[offset];
                                let p2 = undefined;
                                offset++;
                                for (let i = offset; i < points.length; i++) {

                                    p2 = points[i];

                                    let _str = "(fp_line (start "
                                    _str += ((config.offsetX - p1.x) / -config.factor).toFixed(2);
                                    _str += " ";
                                    _str += ((config.offsetY - p1.y) / -config.factor).toFixed(2);
                                    _str += ") ";
                                    _str += "(end ";
                                    _str += ((config.offsetX - p2.x) / -config.factor).toFixed(2);
                                    _str += " ";
                                    _str += ((config.offsetY - p2.y) / -config.factor).toFixed(2);
                                    _str += ") ";

                                    _str += "(layer ";
                                    _str += GetLayerString(element.properties.layerid);
                                    _str += ") ";
                                    _str += "(width ";
                                    _str += (parseFloat(element.properties["stroke-width"]) / config.factor).toFixed(2);
                                    _str += "))";
                                    Tab2.push(_str);

                                    p1 = p2;
                                }


                                break;
                            }
                        }
                    }
                    break;
                }
                case 'path': {
                    if (element.properties && element.properties.c_helper_type) {
                        if (element.properties.c_helper_type == "arc2") {
                            let str = element.properties.d.trim();
                            let x0 = 0.0;
                            let y0 = 0.0;
                            let x1 = 0.0;
                            let y1 = 0.0;
                            let rx = 0.0;
                            let ry = 0.0;
                            let alpha = 0.0;
                            let sweep = false;
                            let larc = false;

                            if (str.startsWith('M')) {
                                str = str.replace('M', '').trim();
                                str = str.replace(',', ' ');
                                x0 = parseFloat(str.split(' ')[0]);
                                y0 = parseFloat(str.split(' ')[1]);
                                str = str.replace(x0, '').replace(y0, '').trim();
                            }

                            if (str.startsWith('A')) {
                                str = str.replace('A', '').trim();
                                str = str.replace(',', ' ');
                                rx = parseFloat(str.split(' ')[0]);
                                ry = parseFloat(str.split(' ')[1]);
                                str = str.replace(rx, '').replace(ry, '').trim();
                            }

                            alpha = parseFloat(str.split(' ')[0]);
                            str = str.replace(alpha, '').trim();

                            larc = parseInt(str.split(' ')[0]) == "0" ? false : true;
                            str = str.replace(str.split(' ')[0], '').trim();

                            sweep = parseInt(str.split(' ')[0]) == "0" ? false : true;
                            str = str.replace(str.split(' ')[0], '').trim();

                            str = str.replace(',', ' ');
                            x1 = parseFloat(str.split(' ')[0]);
                            y1 = parseFloat(str.split(' ')[1]);

                            str = str.replace(x1, '').replace(y1, '').trim();

                            let as = new ArcSegmenter(
                                (config.offsetX - x0) / -config.factor,
                                (config.offsetY - y0) / -config.factor,
                                (config.offsetX - x1) / -config.factor,
                                (config.offsetY - y1) / -config.factor,
                                rx / config.factor, ry / config.factor, alpha, sweep, larc);

                            let increment = 0.01;
                            let p1 = as.getpnt(0.0);
                            let p2 = undefined;
                            for (let t = increment; t < 1.00000001; t += increment) {
                                p2 = as.getpnt(t);

                                let _str = "(fp_line (start "
                                _str += p1.x.toFixed(2);
                                _str += " ";
                                _str += p1.y.toFixed(2);
                                _str += ") ";
                                _str += "(end ";
                                _str += p2.x.toFixed(2);
                                _str += " ";
                                _str += p2.y.toFixed(2);
                                _str += ") ";
                                _str += "(layer ";
                                _str += GetLayerString(element.properties.layerid);
                                _str += ") ";
                                _str += "(width ";
                                _str += (parseFloat(element.properties["stroke-width"]) / config.factor).toFixed(2);
                                _str += "))";
                                Tab2.push(_str);

                                p1 = p2;
                            }
                            break;
                        }
                    }else if (element.properties && element.properties.c_shapetype) {
                        switch (element.properties.c_shapetype) {
                            case 'line': {
                                let points = [];
                                if ( element.properties.d.includes("L") == true ){
                                    element.properties.d.split('L').forEach((s) => {
                                        if ( s.startsWith('M') ){
                                            s = s.replace('M' , '');
                                        }
                                        s = s.trim();
                                        let _s = s.replace(',', ' ').split(' ');
                                        points.push({
                                            x: parseFloat(_s[0]),
                                            y: parseFloat(_s[1])
                                        });
                                    });
                                }

                                let offset = 0;
                                let p1 = points[offset];
                                let p2 = undefined;
                                offset++;
                                for (let i = offset; i < points.length; i++) {

                                    p2 = points[i];

                                    let _str = "(fp_line (start "
                                    _str += ((config.offsetX - p1.x) / -config.factor).toFixed(2);
                                    _str += " ";
                                    _str += ((config.offsetY - p1.y) / -config.factor).toFixed(2);
                                    _str += ") ";
                                    _str += "(end ";
                                    _str += ((config.offsetX - p2.x) / -config.factor).toFixed(2);
                                    _str += " ";
                                    _str += ((config.offsetY - p2.y) / -config.factor).toFixed(2);
                                    _str += ") ";
                                    _str += "(layer ";
                                    _str += GetLayerString(element.properties.layerid);
                                    _str += ") ";
                                    _str += "(width ";
                                    _str += (parseFloat(element.properties["stroke-width"]) / config.factor).toFixed(2);
                                    _str += "))";
                                    Tab2.push(_str);

                                    p1 = p2;
                                }
                                break;
                            }
                        }
                    }
                    break;
                }
                case 'polyline': {
                    if (element.properties && element.properties.c_shapetype) {
                        switch (element.properties.c_shapetype) {
                            case 'line': {
                                let points = [];
                                let _t = element.properties.points.replace(',', ' ').split(' ');
                                for (let i = 0; i < _t.length; i += 2) {
                                    points.push({
                                        x: parseFloat(_t[i]),
                                        y: parseFloat(_t[i + 1])
                                    });
                                }

                                let offset = 0;
                                let p1 = points[offset];
                                let p2 = undefined;
                                offset++;
                                for (let i = offset; i < points.length; i++) {

                                    p2 = points[i];

                                    let _str = "(fp_line (start "
                                    _str += ((config.offsetX - p1.x) / -config.factor).toFixed(2);
                                    _str += " ";
                                    _str += ((config.offsetY - p1.y) / -config.factor).toFixed(2);
                                    _str += ") ";
                                    _str += "(end ";
                                    _str += ((config.offsetX - p2.x) / -config.factor).toFixed(2);
                                    _str += " ";
                                    _str += ((config.offsetY - p2.y) / -config.factor).toFixed(2);
                                    _str += ") ";
                                    _str += "(layer ";
                                    _str += GetLayerString(element.properties.layerid);
                                    _str += ") ";
                                    _str += "(width ";
                                    _str += (parseFloat(element.properties["stroke-width"]) / config.factor).toFixed(2);
                                    _str += "))";
                                    Tab2.push(_str);

                                    p1 = p2;
                                }

                                break;
                            }
                        }
                    }
                    break;
                }
                case 'g': {
                    if (element.properties && element.properties.c_etype) {
                        switch (element.properties.c_etype) {
                            case 'pinpart': {
                                let _str = "(pad " + element.properties.number + " ";

                                switch (element.properties.layerid) {
                                    case 1: {
                                        _str += "smd";
                                        break;
                                    }
                                    case 11: {
                                        _str += "thru_hole";
                                    }
                                }

                                _str += " ";

                                if (element.properties.c_partid == 'part_hole') {
                                    break;
                                }

                                let padFormat = element.properties.c_shape.toLowerCase();
                                if (element.properties.c_shape.toUpperCase() == "ELLIPSE") {
                                    padFormat = "circle";
                                }
                                _str += padFormat;
                                _str += " ";
                                _str += "(at ";
                                _str += ((config.offsetX - parseFloat(element.properties.c_origin.replace(',', ' ').split(' ')[0])) / -config.factor).toFixed(2);
                                _str += " ";
                                _str += ((config.offsetY - parseFloat(element.properties.c_origin.replace(',', ' ').split(' ')[1])) / -config.factor).toFixed(2);
                                _str += ") ";
                                _str += "(size ";
                                _str += (element.properties.c_width / config.factor).toFixed(2);
                                _str += " ";
                                _str += (element.properties.c_height / config.factor).toFixed(2);
                                _str += ") ";
                                _str += "(layers ";
                                _str += GetLayerString(element.properties.layerid);
                                _str += ")";
                                _str += ")";
                                Tab2.push(_str);
                                break;
                            }
                        }
                    }
                    break;
                }
                default:
                    break;
            }
        });

        resolve(Tab2);
    });
}
