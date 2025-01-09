import api from '../../api';
import HTMLParser from 'node-html-parser';
import easyeda from '../../utils/easyeda';

export default {
    getComponent: async (url = "") => {
        try {
            let component = {};

            let response = await api.get(url);
            let html = HTMLParser.parse(response);

            component.manufacturer = html.querySelector("#app > div.v-application--wrap > main > div > div > div > div > div.flex-auto > div.rounded.white.pa-6.d-flex.flex-column.flex-md-row.align-center.align-md-stretch > div.pl-md-6.flex-auto.align-self-stretch.mt-6.mt-md-0 > table > tbody > tr:nth-child(1) > td:nth-child(2) > div > a")?.innerHTML?.trim();
            component.lcscPartNumber = html.querySelector("#app > div.v-application--wrap > main > div > div > div > div > div.flex-auto > div.rounded.white.pa-6.d-flex.flex-column.flex-md-row.align-center.align-md-stretch > div.pl-md-6.flex-auto.align-self-stretch.mt-6.mt-md-0 > table > tbody > tr:nth-child(3) > td:nth-child(2) > div > span")?.innerHTML?.trim();
            component.manufacturerPartnumber = html.querySelector("#app > div.v-application--wrap > main > div > div > div > div > div.flex-auto > div.rounded.white.pa-6.d-flex.flex-column.flex-md-row.align-center.align-md-stretch > div.pl-md-6.flex-auto.align-self-stretch.mt-6.mt-md-0 > table > tbody > tr:nth-child(2) > td:nth-child(2) > div > span")?.innerHTML?.trim();
            component.datasheet = html.querySelector("#app > div.v-application--wrap > main > div > div > div > div > div.flex-auto > div.rounded.white.pa-6.d-flex.flex-column.flex-md-row.align-center.align-md-stretch > div.pl-md-6.flex-auto.align-self-stretch.mt-6.mt-md-0 > table > tbody > tr:nth-child(7) > td:nth-child(2) > a > span")?.attributes?.href?.trim();
            component.description = html.querySelector("#app > div.v-application--wrap > main > div > div > div > div > div.flex-auto > div.rounded.white.pa-6.d-flex.flex-column.flex-md-row.align-center.align-md-stretch > div.pl-md-6.flex-auto.align-self-stretch.mt-6.mt-md-0 > table > tbody > tr:nth-child(6) > td:nth-child(2) > div > span")?.innerHTML?.trim();
            component.package = html.querySelector("#app > div.v-application--wrap > main > div > div > div > div > div.flex-auto > div.rounded.white.pa-6.d-flex.flex-column.flex-md-row.align-center.align-md-stretch > div.pl-md-6.flex-auto.align-self-stretch.mt-6.mt-md-0 > table > tbody > tr:nth-child(4) > td:nth-child(2) > div > span")?.innerHTML?.trim();

            component.has3dModel = false;
            component.hasSymbol = false;
            component.hasFootprint = false;

            return {
                component: component
            };

        } catch (err) {
            throw { message: err.message };
        }
    },
    getSymbol: async (component = {}) => {
        try {
            let res = await api.get("https://easyeda.com/api/products/" + component.lcscPartNumber + "/components?version=6.4.19.5");
            let js = JSON.parse(res);
            if (js.success == true) {
                let _res = await easyeda.getSymbol(js.result);
                return {
                    librarie: _res,
                }
            } else {
                throw { message: "Symbol not found" }
            }
        } catch (err) {
            throw { message: err.message };
        }
    },
    getFootprint: async (component = {}) => {
        try {
            let res = await api.get("https://easyeda.com/api/products/" + component.lcscPartNumber + "/components?version=6.4.19.5");
            let js = JSON.parse(res);
            if (js.success == true) {
                let _res = await easyeda.getFootprint(js.result);
                return {
                    footprint: _res,
                }
            } else {
                throw { message: "Footprint not found" }
            }
        } catch (err) {
            throw { message: err.message };
        }
    },
    getImgSymbol: async (component = {}) => {
        try {
            let model = undefined;
            let respSvgs = await api.get("https://easyeda.com/api/products/" + component.lcscPartNumber + "/svgs");
            if (typeof respSvgs == 'string') {
                respSvgs = JSON.parse(respSvgs)
            }
            if (respSvgs?.success == true) {
                let _symbol = respSvgs.result.find((r) => r.docType == 2);
                if (_symbol && _symbol.svg) {
                    model = _symbol.svg;
                }
            }
            return {
                imgSymbol: model,
            }
        } catch (err) {
            throw { message: err.message };
        }
    },
    getImgFootprint: async (component = {}) => {
        try {
        } catch (err) {
            throw { message: err.message };
        }
    },
    get3DModel: async(component) => {
        try {
            if (component.footprint.model_3d.uuid != undefined) {
                let res = await api.get("https://easyeda.com/analyzer/api/3dmodel/" + component.footprint.model_3d.uuid);
                component.footprint.model_3d.raw_obj = res;

                if (res != undefined) {
                    let _res = await easyeda.get3DModel(component.footprint.model_3d.raw_obj);
                    return {
                        model3d: _res,
                    }
                } else {
                    throw { message: "Symbol not found" }
                }

            } else {
                return {
                    model3d: undefined,
                }
            }
        } catch (err) {
            throw { message: err.message };
        }
    }
}