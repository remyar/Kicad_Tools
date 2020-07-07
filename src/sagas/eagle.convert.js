import xml2js from 'xml2js';

export default async (eagleFile) => {

    let fileList = {
        symbols: [],
        packages: []
    }

    fileList.symbols = [];
    fileList.packages = [];

    let parser = new xml2js.Parser();

    let xmlObj = await parser.parseStringPromise(eagleFile);

    xmlObj.eagle.drawing.map((drawing) => {
        drawing.library.map((library) => {
            library.symbols.map((symbols) => {
                symbols.symbol.map((symbol) => {
                    let s = {};
                    s.description = symbol.description;
                    s.name = symbol.$.name;
                    s.pin = [];
                    symbol.pin.map((pin) => {
                        s.pin.push(pin.$);
                    });

                    s.text = [];
                    symbol.text.map((text) => {
                        let o = text.$;
                        o.text = text._;
                        s.text.push(o);
                    });

                    s.wire = [];
                    symbol.wire.map((wire) => {
                        s.wire.push(wire.$);
                    });

                    fileList.symbols.push(s);
                });
            });
        });
    });

    xmlObj.eagle.drawing.map((drawing) => {
        drawing.library.map((library) => {
            library.packages.map((footprints) => {
                footprints.package.map((pack) => {
                    let s = {};
                    s.description = pack.description;
                    s.name = pack.$.name;

                    s.circle = [];
                    pack.circle.map((circle) => {
                        s.circle.push(circle.$);
                    });

                    s.text = [];
                    pack.text.map((text) => {
                        let o = text.$;
                        o.text = text._;
                        s.text.push(o);
                    });

                    s.smd = [];
                    pack.smd && pack.smd.map((smd) => {
                        s.smd.push(smd.$);
                    });

                    s.pad = [];
                    pack.pad && pack.pad.map((pad) => {
                        s.pad.push(pad.$);
                    });

                    s.wire = [];
                    pack.wire.map((wire) => {
                        s.wire.push(wire.$);
                    });

                    fileList.packages.push(s);
                });
            });
        });

    });

    return fileList;
}