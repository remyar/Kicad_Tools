<template>

    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item">
                <span class="nav-link" @click="goToHome" >Home </span>
            </li>
            <li class="nav-item">
                <span class="nav-link" @click="loadKicadProject" >Create Bom </span>
            </li>
            <li class="nav-item">
                <span class="nav-link" @click="loadEagleLib" >Eagle Lib Converter </span>
            </li>
        </ul>
    </nav>

</template>

<script>
import { mapGetters, mapState } from 'vuex';
import navigation from '../vendor/navigation';
//const {dialog} = require('electron').remote;

export default {

    methods :{
        goToHome : function(){
            navigation.forwardTo("/");
        },
        loadKicadProject : function(ev)
        {
            this.$store.dispatch('kicad_file/open');
          /*  let _self = this;
            dialog.showOpenDialog({       
                properties: ['openFile'],
                filters : [{name : "Kicad Project" , extensions : ["pro"] }]
            }, function (files) {
                if (files !== undefined) {
                    
                    files.map((f , idx ) => {
                        files[idx] = f.replace(".pro" , ".sch");
                    })
                    _self.$store.dispatch( 'kicad_file/open', files);
                }
            });  */  
        },
        loadEagleLib : function(ev)
        {
            this.$store.dispatch('eagle_file/open');
          /*  let _self = this;
            dialog.showOpenDialog({       
                properties: ['openFile'],
                filters : [{name : "Eagle Librarie" , extensions : ["lbr"] }]
            }, function (files) {
                if (files !== undefined) {
                    _self.$store.dispatch( 'eagle_file/open', files);
                }
            });*/
        }
    }
}
</script>