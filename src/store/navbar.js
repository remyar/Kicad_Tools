
// initial state
const state = {  
    items : [],
}

const getters = {
    todoList : (state, getters, rootState) => {
        return state.items;
    }

}

// actions
const actions = {
    addTodo({ commit , state }, text){
        commit({
            type: 'addTodo',
            text
        });
    }
}

// mutations
const mutations = {
    addTodo (state, status) {
        state.items.push(status);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  }