import { Ki3dModel } from './parameters_kicad_footprint';

function get_materials(obj_data) {
    let materials = {};
    let material_id = undefined;
    let matchs = obj_data.split("newmtl").slice(1);
    matchs = matchs.map((el) => {
        return "newmtl " + el.split("endmtl")[0].trim();
    });

    for (let match of matchs) {
        let material = {};
        for (let value of match.split("\n")) {
            value = value.trim();
            if (value.startsWith("newmtl")) {
                material_id = value.split(" ")[1];
            } else if (value.startsWith("Ka")) {
                material["ambient_color"] = value.split(" ").slice(1);
            } else if (value.startsWith("Kd")) {
                material["diffuse_color"] = value.split(" ").slice(1);
            } else if (value.startsWith("Ks")) {
                material["specular_color"] = value.split(" ").slice(1);
            } else if (value.startsWith("d")) {
                material["transparency"] = value.split(" ").slice(1);
            }
        }
        materials[material_id] = material
    }
    return materials

}

function get_vertices(obj_data) {
    let vertices_regex = "v (.*?)\n";

    let fff = [...obj_data.matchAll(vertices_regex)];
    let vertices = [];

    for (let vertice of fff) {
        let __v = [];
        for (let coord of vertice[1].split(" ")) {
            __v.push((parseFloat(coord) / 2.54).toFixed(4));
        }
        vertices.push(__v.join(" "));
    }

    return vertices;
}

function generate_wrl_model(model_3d) {
    let materials = get_materials(model_3d);
    let vertices = get_vertices(model_3d);

    let raw_wrl = '#VRML V2.0 utf8\r\n';
    raw_wrl += '# 3D model generated by kicad_tools (https://github.com/remyar\r\n';
    raw_wrl += '\r\n';

    let shapes = model_3d.split("usemtl").splice(1);
    for (let shape of shapes) {
        let lines = shape.replace("\r\n", "\n").replace("\r", "\n").split("\n").filter(r => r != undefined);
        let material = materials[lines[0].replace(" ", "").trim()];
        let index_counter = 0;
        let link_dict = {};
        let coord_index = [];
        let points = [];

        for (let line of lines.slice(1)) {
            if (line.length > 0) {
                let face = [...line.split(" ").map(e => parseInt(e.replace("//", "")))].slice(1);
                let face_index = [];
                for (let index of face) {
                    if (link_dict[index] == undefined) {
                        link_dict[index] = index_counter;
                        face_index.push(index_counter.toString());
                        points.push(vertices[index - 1]);
                        index_counter += 1;
                    } else {
                        face_index.push(link_dict[index].toString());
                    }
                }
                face_index.push("-1");
                coord_index.push(face_index.join(",") + ",");
            }
        }
      //  points = [points[points.length - 1], ...points];

        let shape_str = "Shape{\r\n\
            appearance Appearance {\r\n\
                material  Material 	{\r\n\
                    diffuseColor "+ material['diffuse_color'].join(' ') + "\r\n"
            + " specularColor " + material['specular_color'].join(' ')+ "\r\n"
            + " ambientIntensity 0.2 \r\n transparency "+ material['transparency']+ "\r\n"
            + " shininess 0.5 \r\n\
                }\r\n\
            }\r\n\
            geometry IndexedFaceSet {\r\r ccw TRUE \r\n solid FALSE \r\n \
                coord DEF co Coordinate { \r\n\
                    point ["+ points.join(", ") + "\r\n"
            + "    ]\r\n\
                } \r\n\
                coordIndex [\r\n"+
            coord_index.join('') + "\r\n"
            + "] \r\n\
            }\r\n \
        }\r\n";

        raw_wrl += shape_str;

    }

    return new Ki3dModel({ raw_wrl: raw_wrl });
}


export class Exporter3dModelKicad {
    input = {};
    output = "";

    constructor(model_3d) {
        if (model_3d) {
            this.output = generate_wrl_model(model_3d);
        }
        else {
            this.output = undefined;
        }
    }

    export(){
        return this.output.raw_wrl;
    }
}