
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
    open({ commit , _state } , file ){
        let _self = this;

        if ( file == undefined){
            dialog.showOpenDialog({       
                properties: ['openFile'],
                filters : [
                   // {name : "Kicad Project" , extensions : ["pro"] },
                    {name : "Kicad xml" , extensions : ["xml"] },
                ]
            }, function (files) {
                if (files !== undefined) {
                    kicad_file.open(files).then((file)=>{
                        commit({type: 'ok' ,  file});  
                        navigation.forwardTo("/bom");
                    }).catch((err) => {
                        commit({type: 'fail'  }); 
                        _self.dispatch('modal/push', { title : 'Erreur' , string : err.message  })
                    })
                }
            });
        }
        else
        {
            //-- ouverture d'un fichier via arg
            kicad_file.open([file]).then((file)=>{
                commit({type: 'ok' ,  file});  
                navigation.forwardTo("/bom");
            }).catch((err) => {
                commit({type: 'fail'  }); 
                _self.dispatch('modal/push', { title : 'Erreur' , string : err.message  })
            })
        }
    },
    convertPcbToFootprint({ commit , _state }){
      
        let _self = this;
        dialog.showOpenDialog({       
            properties: ['openFile'],
            filters : [
                {name : "Kicad Pcb" , extensions : ["kicad_pcb"] },
            ]
        }, function (files) {
            if (files !== undefined) {
                kicad_file.open(files).then((file)=>{
                    commit({type: 'ok' ,  file});  
                    navigation.forwardTo("/convertPcbToFootprint");
                }).catch((err) => {
                    commit({type: 'fail'  }); 
                    _self.dispatch('modal/push', { title : 'Erreur' , string : err.message  })
                })
            }
        });
    },
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