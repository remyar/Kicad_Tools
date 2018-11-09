import pdfkit from '../vendor/pdf'


// initial state
var state = {  

}

const getters = {

}

// actions
const actions = {
    save({ commit , _state } , file ){
        let _self = this;

        pdfkit.saveBOM(file);
    }
}

// mutations
const mutations = {

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  }