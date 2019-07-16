import localeData from './data.json';

function formatMessage (obj){

    let returnText="";

    if ( obj.id != undefined ){
        returnText = obj.id;

        let msg = getMessages()[returnText];

        if ( msg != undefined ){
            returnText = msg;
        }
    }

    return returnText;
}

function getLanguage(withoutRegionCode){
    // Define user's language. Different browsers have the user locale defined
    // on different fields on the `navigator` object, so we make sure to account
    // for these different by checking all of them
    const language = (navigator.languages && navigator.languages[0]) ||
                        navigator.language ||
                        navigator.userLanguage;
    
    // Split locales with a region code
    const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

    if ( withoutRegionCode != undefined &&  withoutRegionCode == true){
        return languageWithoutRegionCode;
    } else {
        return language;
    }
}

function getMessages(){
    // Try full locale, try locale without region code, fallback to 'en'
    return localeData[getLanguage(true)] || localeData[getLanguage()] || localeData.en;

}

export default {
    formatMessage,
    getLanguage,
    getMessages
}