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
                      "keyword": "LM358ADT",
                      "records": 0,
                      "startingRecord": 0,
                      "searchOptions": "string",
                      "searchWithYourSignUpLanguage": "string"
                    }
                  }
            )
        }).then((response)=>{
            if ( response.status == 200){
                return response.json();
            } else {
                reject();
            }
        }).then((json)=>{
            return json.SearchResults.Parts;
        }).catch(()=>{
            reject();
        })
    });
}

export default {
    search,
}