import HTMLParser from 'node-html-parser';

export default {
    getComponent: async (url, mainWindow, middleware) => {
        try {
            let component = {};
            let response = await middleware.fetch.Get(url.url);
            let html = HTMLParser.parse(response);

            const nextData = html.querySelector("#__NEXT_DATA__");

            if (nextData) {
                const data = JSON.parse(nextData.textContent);
                component.manufacturer = data.props?.pageProps?.webData?.brandNameEn ?? null;
                component.lcscPartNumber = data.props?.pageProps?.webData.productCode ?? null;
                component.manufacturerPartNumber = data.props?.pageProps?.webData.productModel ?? null;
                component.datasheet = data.props?.pageProps?.webData.pdfUrl ?? null;
                component.description = data.props?.pageProps?.webData.productDescEn ?? null;
                component.package = data.props?.pageProps?.webData.encapStandard ?? null;
            }

            component.has3dModel = false;
            component.hasSymbol = false;
            component.hasFootprint = false;

            return component;
        } catch (err) {
            throw err;
        }
    },
    getSymbol: async (component, mainWindow, middleware) => {
        try {
            const cadUrl = `https://easyeda.com/api/products/${component.component.lcscPartNumber}/components?version=6.5.44`;
            let res = await middleware.fetch.Get(cadUrl);
            let js = JSON.parse(res);
            if ( js.success == true )
            {

            }
        } catch (err) {
            throw err;
        }
    }
}