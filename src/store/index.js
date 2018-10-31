import Vue from 'vue';
import Vuex from 'vuex';
import navbar from './navbar';
import dummy from './dummy';
import kicad_file from './kicad_file';
import eagle_file from './eagle_file';
import modal from './modal';


Vue.use(Vuex)


export default new Vuex.Store({
    strict: true,
    
    modules: {
        navbar,
        kicad_file,
        eagle_file,
        modal,
    },
});