import axios from 'axios'

export default function get(url) {
    return new Promise(async (resolve, reject) => {
        if ( process.env.REACT_APP_PROXY ){
            url = process.env.REACT_APP_PROXY + url;
        }
        try {
            let response = await axios.get(url);
            resolve(response.data)
        } catch (err) {
            reject(err);
        }
    });
}
