import Store from 'electron-store';
const store = new Store();

function get( key ){
    return store.get(key);
}

function set(key , val){
    store.set(key , val);
}

export default {
    set,
    get,
}