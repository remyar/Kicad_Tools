import createAction from '../../middleware/actions';
import HTMLParser from 'node-html-parser';

export async function getComponent(url, { extra, getState }) {

    let api = extra.api;

    try {

        let component = {
            svgs: []
        };

        let response = await api.get('/fetch/' + url);
        let html = HTMLParser.parse(response);

        component.manufacturer = html.querySelector("#app > div > main > div > div > div.padX.padY.base > div > div > div.left > div.product-info > div.desc > table > tbody > tr:nth-child(1) > td:nth-child(2) > a")?.innerHTML?.trim();
        component.lcscPartNumber = html.querySelector("#app > div > main > div > div > div.padX.padY.base > div > div > div.left > div.product-info > div.desc > table > tbody > tr:nth-child(3) > td:nth-child(2)")?.innerHTML?.trim();
        component.manufacturerPartnumber = html.querySelector("#app > div > main > div > div > div.padX.padY.base > div > div > div.left > div.product-info > div.desc > table > tbody > tr:nth-child(2) > td:nth-child(2)")?.innerHTML?.trim();
        component.datasheet = html.querySelector("#app > div > main > div > div > div.padX.padY.base > div > div > div.left > div.product-info > div.desc > table > tbody > tr:nth-child(6) > td:nth-child(2) > a")?.attributes?.href?.trim();
        component.description = html.querySelector("#app > div > main > div > div > div.padX.padY.base > div > div > div.left > div.product-info > div.desc > table > tbody > tr:nth-child(8) > td:nth-child(2)")?.innerHTML?.trim();
        component.package = html.querySelector("#app > div > main > div > div > div.padX.padY.base > div > div > div.left > div.product-info > div.desc > table > tbody > tr:nth-child(4) > td:nth-child(2)")?.innerHTML?.trim();
        component.datasheet = html.querySelector("#app > div > main > div > div > div.padX.padY.base > div > div > div.left > div.product-info > div.desc > table > tbody > tr:nth-child(6) > td:nth-child(2) > a")?.attributes?.href?.trim();
        
        component.hasSymbol = false;
        component.hasFootprint = false;
        let respSvgs = await api.get('/fetch/' + "https://easyeda.com/api/products/" + component.lcscPartNumber + "/svgs");
        if ( respSvgs?.result ){
            component.svgs = respSvgs.result; 
            component.hasSymbol = component.svgs.find((x) => x.docType == 2) ? true : false;
            component.hasFootprint = component.svgs.find((x) => x.docType == 4) ? true : false;
        } 

        return {
            component: component
        };
    } catch (err) {
        throw { message: err.message };
    }
}

export default createAction(getComponent);