
import kicad_file from '../vendor/kicad';
import navigation from '../vendor/navigation';
const {dialog} = require('electron').remote;

// initial state
var state = {  
    status : 'none',
    file : {}
}

const getters = {

    lines : ( _state , _getters , _rootState ) => {
        return _state.file;
    },
    components : ( _state , _getters , _rootState ) => {
        return _state.file;
    }
}

// actions
const actions = {
    open({ commit , _state }){

        dialog.showOpenDialog({       
            properties: ['openFile'],
            filters : [{name : "Kicad Project" , extensions : ["pro"] }]
        }, function (files) {
            if (files !== undefined) {
                files.map((f , idx ) => {
                    files[idx] = f.replace(".pro" , ".sch");
                });

                kicad_file.open(files).then((file)=>{
                    commit({type: 'ok' ,  file});  
                    navigation.forwardTo("/bom");
                }).catch((err) => {
                    commit({type: 'fail'  }); 
                    this.dispatch('modal/push', { title : 'Erreur' , string : err.message  })
                })
            }
        });
    }
}

// mutations
const mutations = {
    ok ( _state , _payload ){
      _state.file = _payload.file;
    },
    fail ( _state , _payload ){
        _state.status = _payload.type;
        _state.file = [];
    },

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  }