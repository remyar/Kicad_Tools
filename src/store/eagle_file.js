import eagle from '../vendor/eagle';
import navigation from '../vendor/navigation';
const {dialog} = require('electron').remote;

// initial state
var state = {  
    status : 'none',
    symbols : [],
    packages : []
}

const getters = {

    symbols : ( _state , _getters , _rootState ) => {
        return _state.symbols;
    },
    packages : ( _state , _getters , _rootState ) => {
        return _state.packages;
    }
}

// actions
const actions = {
    open({ commit , _state }){

        dialog.showOpenDialog({       
            properties: ['openFile'],
            filters : [{name : "Eagle Librarie" , extensions : ["lbr"] }]
        }, function (files) {
            if (files !== undefined) {
                eagle.open(files).then((text)=>{

                    commit({type: 'ok' ,  symbols : eagle.getSymbols() , footprints : eagle.getFootprints() }); 
        
                    navigation.forwardTo("/eagleSymbol");
                }).catch((err) => {
                    commit({type: 'fail'  }); 
                    this.dispatch('modal/push', { title : 'Erreur' , string : err.message  })
                })
            }
        });


        
    },
    exportToFile({ commit , _state }, data){
        let _self = this;
        dialog.showSaveDialog({
            filters : [{name : "Kicad Librarie" , extensions : ["lib"] }]
        },function(fileName){
            if ( fileName !== undefined){
                eagle.exportToFile( data.data , fileName).then(()=>{

                }).catch((err)=>{
                    _self.dispatch('modal/push', { title : 'Erreur' , string : err.message  });
                })
            }
            else
                _self.dispatch('modal/push', { title : 'Erreur' , string : "Erreur lors de la sauvegarde" });
        });
        
    },
}

// mutations
const mutations = {
    ok ( _state , _payload ){
        _state.status = _payload.type;
        _state.symbols = _payload.symbols;
        _state.packages = _payload.footprints;
    },
    fail ( _state , _payload ){
        _state.status = _payload.type;
        _state.symbols = [];
        _state.packages = [];
    },

}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
  }