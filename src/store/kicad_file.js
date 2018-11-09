
import kicad_file from '../vendor/kicad';
import navigation from '../vendor/navigation';
const {dialog} = require('electron').remote;

// initial state
var state = {  
    status : 'none',
    components : {},
    project : {}
}

const getters = {

    project : ( _state , _getters , _rootState ) => {
        return _state.project;
    },
    components : ( _state , _getters , _rootState ) => {
        return _state.components;
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
                    _self.dispatch('preloader/show');
                    kicad_file.open(files).then((components)=>{
                        let payload = {}
                        payload.components = components;
                        payload.project = "PUCE"
                        commit({type: 'ok' , payload });  
                        _self.dispatch('preloader/hide');
                        navigation.forwardTo("/bom");
                    }).catch((err) => {
                        commit({type: 'fail'  }); 
                        _self.dispatch('preloader/hide');
                        _self.dispatch('modal/push', { title : 'Erreur' , string : err.message  })
                    })
                }
            });
        }
        else
        {
            _self.dispatch('preloader/show');
            //-- ouverture d'un fichier via arg
            kicad_file.open([file]).then((components)=>{
                let payload = {}
                payload.components = components;
                payload.project = "PUCE"
                commit({type: 'ok' , payload }); 
                _self.dispatch('preloader/hide');
                navigation.forwardTo("/bom");
            }).catch((err) => {
                commit({type: 'fail'  }); 
                _self.dispatch('preloader/hide');
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
        _state.components = _payload.payload.components;
        _state.project = _payload.payload.project;
    },
    fail ( _state , _payload ){
        _state.status = _payload.type;
        _state.components = {};
        _state.project = {};
    },

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  }