<template>
    <div>

        <div class="centre">
            <button type="button" class="form-control btn btn-primary" @click="loadKicadProject">Générer Kicad BOM</button>
            <br><br>
            <button type="button" class="form-control btn btn-primary" @click="loadEagleLib" >.lbr Eagle en .lib Kicad</button>
        </div>

    </div>
</template>

<script>


import { mapGetters, mapState } from 'vuex';
const remote = require('electron').remote;

export default {
    computed:{

    },
    components : {
        
    },
    methods :{
        loadKicadProject : function(ev)
        {
            this.$store.dispatch('kicad_file/open');
        },
        loadEagleLib : function(ev)
        {
            this.$store.dispatch('eagle_file/open');
        }
    },
    mounted(){
        let argList = remote.process.argv.join(' ');
        let arg = argList.match( /\<([\s\S]*?)\>/gi)[0].replace("<" , "").replace(">" ,"").trim();

        if ( arg.length > 0 )
            this.$store.dispatch('kicad_file/open' , arg);
    }
}
</script>