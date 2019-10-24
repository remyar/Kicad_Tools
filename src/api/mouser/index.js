const fetch = require('isomorphic-fetch');
const API_KEY = "3aed3522-1134-44f9-9e2c-5b0ca35290c9";

function search(reference){
    return new Promise((resolve , reject ) => {
        fetch("https://api.mouser.com/api/v1/search/keyword?apiKey=" +  API_KEY, {
            headers: {
                'Cache-Control': 'no-cache',
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            method: "POST",
            body: JSON.stringify(
                {
                    "SearchByKeywordRequest": {
                      "keyword": reference,
                    }
                  }
            )
        }).then((response)=>{
            if ( response.status == 200){
                resolve(response.json());
            } else {
                reject(response.json());
            } 
        }).catch((e)=>{
            reject(e);
        })
    });
}


function searchAll(bom) {
    let promiseTab = [];
    for ( let key in bom ){
        bom[key].map((component) => {
            if ( component.mfrnum != undefined ){
                promiseTab.push(this.search(component.mfrnum));
            }
        });
    }
    return Promise.all(promiseTab).then((results)=>{
        results.map((result) => {
            let parts = result.SearchResults.Parts;

            parts.map((part) => {
                for ( let key in bom ){
                    bom[key].map((component , idx) => {
                        if ( component.mfrnum != part.ManufacturerPartNumber ){
                            bom[key][idx].mouser = part.ProductDetailUrl;
 
                            part.PriceBreaks.map((price) => {
                                if ( component.nbRefs >= price.Quantity ){
                                    bom[key][idx].unitPrice = price.Price.replace(',','.');
                                }
                            });

                            bom[key][idx].totalPrice = parseFloat(bom[key][idx].unitPrice.replace(',','.')) * component.nbRefs;
                        }
                    });
                }
            })
        })
        return Promise.resolve(bom);
    }).catch((e)=>{
        return Promise.reject(bom);
    })
}

export default {
    search,
    searchAll,
}