import axios from 'axios'

export default function post(url , data) {
    return new Promise(async (resolve, reject) => {
        if ( process.env.REACT_APP_PROXY ){
            url = process.env.REACT_APP_PROXY + url;
        }
        try {
            let response = await axios.post(url , data);
            resolve(response);
        } catch (err) {
            reject(err);
        }
    });
}