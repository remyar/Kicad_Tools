<template>
    <div>

        <div class="centre">
            <button type="button" class="form-control btn btn-primary" @click="loadKicadProject">{{ $t("index.generateKicadBom") }}</button>
            <br><br>
            <button type="button" class="form-control btn btn-primary" @click="loadEagleLib" >{{ $t("index.convertEaglelbrToLibKicad") }}</button>
            <br><br>
            <button type="button" class="form-control btn btn-primary" @click="convertKicadPcbToFootPrint" >{{ $t("index.convertKicadPCBToFootprint") }}</button>
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
        },
        convertKicadPcbToFootPrint : function(ev)
        {
            this.$store.dispatch('kicad_file/convertPcbToFootprint');
        },
    },
    mounted(){
        let argList = remote.process.argv.join(' ');
        let fileList = argList.match( /\<([\s\S]*?)\>/gi);
        let arg = "";
        if ( fileList && fileList.length > 0 )
            arg = fileList[0].replace("<" , "").replace(">" ,"").trim();

        //arg = "D:/_DEV_/DEV_SLOT/Davic/Puce-auto/PUCE/PUCE.xml"
        if ( arg.length > 0 )
            this.$store.dispatch('kicad_file/open' , arg);
    }
}
</script>