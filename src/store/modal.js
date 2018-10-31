
// initial state
const state = {  
    modal : {}
}

const getters = {
    data : (state, getters, rootState) => {
        return state.modal;
    }

}

// actions
const actions = {
    push({ commit , state }, obj){
        commit({
            type: 'push',
            obj
        });
    },
    pop({ commit , state }){
        commit({
            type: 'pop'
        });
    }
}

// mutations
const mutations = {
    push (state, status) {
        state.modal = status.obj;
    },
    pop ( state ){
        state.modal = {};
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  }