import axios from 'axios'

export default function get(url) {
    return new Promise(async (resolve, reject) => {
        try {
            let response = await axios.get('/' + url);
            resolve(response.data)
        } catch (err) {
            reject(err);
        }
    });
}
