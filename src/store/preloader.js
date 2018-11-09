import Vue from 'vue';

// initial state
const state = {  
    preloader : { show : false }
}

const getters = {
    show : (_state, getters, rootState) => {
        return (_state.preloader.show == true) ? true : undefined;
    }

}

// actions
const actions = {
    show({ commit , _state }){
        commit({
            type: 'show',
            show : true
        });
    },
    hide({ commit , _state }){
        commit({
            type: 'show',
            show : false
        });
    }
}

// mutations
const mutations = {
    show (_state, status) {
       Vue.set(_state,'preloader' ,status )
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  }