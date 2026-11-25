/*
const svg_path_handlers = {
    "M": SvgPathMoveTo,
    "A": SvgPathEllipticalArc,
    "L": SvgPathLineTo,
    "Z": SvgPathClosePath,
}
*/
function SvgPathMoveTo(path) {
    return {
        start_x: parseFloat(path[0]),
        start_y: parseFloat(path[1])
    }
}

function SvgPathLineTo(path) {
    return {
        pos_x: parseFloat(path[0]),
        pos_y: parseFloat(path[1])
    }
}

function SvgPathEllipticalArc(path) {
    return {
        radius_x: parseFloat(path[0]),
        radius_y: parseFloat(path[1]),
        x_axis_rotation: parseFloat(path[2]),
        flag_large_arc: parseInt(path[3]) == 1 ? true : false,
        flag_sweep: parseInt(path[4]) == 1 ? true : false,
        end_x: parseFloat(path[5]),
        end_y: parseFloat(path[6]),
    }
}

function SvgPathClosePath(){

}

export default (svg_path) => {
    if (svg_path.endsWith(" ") == false) {
        svg_path += " ";
    }
    svg_path = svg_path.replace(/\,/g, " ");

    let path_splitted = svg_path.matchAll(/([a-zA-Z])([ ,\-\+.\d]+)/g);
    let parsed_path = [];
    for (let path_command of path_splitted) {
        switch (path_command[1]) {
            case 'M':
                {
                    parsed_path.push(SvgPathMoveTo(path_command[2].trim().split(" ")));
                    break;
                }
            case 'A':
                {
                    parsed_path.push(SvgPathEllipticalArc(path_command[2].trim().split(" ")));
                    break;
                }
            case 'L':
                {
                    parsed_path.push(SvgPathLineTo(path_command[2].trim().split(" ")));
                    break;
                }
            case 'Z':
                {
                    parsed_path.push(SvgPathClosePath(path_command[2].trim().split(" ")));
                    break;
                }
            default: {
                console.warn("SVG command path not supported");
            }
        }
    }

    return parsed_path;
}