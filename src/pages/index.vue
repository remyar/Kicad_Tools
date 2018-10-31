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


import { mapGetters, mapState } from 'vuex'

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
    }
}
</script>