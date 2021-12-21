
let config = {
    unit: '0',
    convert: '1',
    thickness: '0',
    fill: 'N'
}

export default async (svg) => {
    return new Promise(async (resolve, reject) => {
        let Tab2 = [];

        let offset = {
            x: parseFloat(svg.properties.c_origin.split(',')[0]),
            y: parseFloat(svg.properties.c_origin.split(',')[1])
        }

        svg.children.forEach(element => {
            let Tab = [];

            switch (element.tagName) {
                case 'rect': {
                    //-- draw rectangle
                    Tab.push("S");
                    Tab.push(((offset.x - parseInt(element.properties.x)) * 10).toString());
                    Tab.push(((offset.y - parseInt(element.properties.y)) * 10).toString());
                    Tab.push(((offset.x - parseInt((element.properties.x + element.properties.width))) * 10).toString());
                    Tab.push(((offset.y - parseInt((element.properties.y + element.properties.height))) * 10).toString());
                    Tab.push(config.unit);
                    Tab.push(config.convert);
                    Tab.push(config.thickness);
                    Tab.push(config.fill);
                    break;
                }
                case 'ellipse': {
                    //  str += "C " + element.properties.cx + " " + element.properties.cy + " " + element.properties.rx + " " + config.unit + " " + config.convert + " " + config.thickness + " "  + config.fill + "\n";
                    //   C posx posy radius unit convert thickness fill
                    break;
                } case 'g': {
                    if (element.properties && element.properties.c_etype) {
                        switch (element.properties.c_etype) {
                            case 'pinpart': {
                                let lineWidth = 0;
                                let pinName = "";

                                if (element.properties.c_partid == 'part_annotation') {
                                    break;;
                                }

                                element.children.forEach((el) => {
                                    if (el.tagName == "text") {
                                        if (el.children && el.children[0].value != element.properties.c_spicepin.toString()) {
                                            pinName = el.children[0].value || "";
                                        }
                                    }
                                    if (el.tagName == "path") {
                                        if (el.properties.display && el.properties.display == "none") {

                                        } else {
                                            let p = el.properties.d;
                                            lineWidth = parseInt(p.split('h')[1]);
                                            if (lineWidth < 0) {
                                                lineWidth *= -1;
                                            }
                                            lineWidth *= 10;
                                        }
                                    }
                                });
                                if ( pinName.length == 0 || lineWidth == NaN){
                                    break;
                                }
                                Tab.push("X");
                                Tab.push(pinName);
                                Tab.push(element.properties.c_spicepin.toString());
                                Tab.push(((offset.x - parseInt(element.properties.c_origin.split(',')[0])) * 10).toString());
                                Tab.push(((offset.y - parseInt(element.properties.c_origin.split(',')[1])) * 10).toString());
                                Tab.push(lineWidth);
                                let rotation = "R"
                                switch (element.properties.c_rotation) {
                                    case 0:
                                        rotation = "R"
                                        break;
                                    case 90:
                                        rotation = "D";
                                        break;
                                    case 180:
                                        rotation = "L";
                                        break;
                                    case 270:
                                        rotation = "U";
                                        break;
                                    default:
                                        rotation = "L";
                                        break;
                                }
                                Tab.push(rotation);
                                Tab.push("50");
                                Tab.push("50");
                                Tab.push("1");
                                Tab.push("1");
                                Tab.push("U");
                                break;
                            }
                        }
                    }
                    break;
                }
            }
            if (Tab.length > 0) {
                Tab2.push(Tab.join(' '));
            }

        });

        resolve(Tab2);
    });
}