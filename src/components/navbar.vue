<template>

    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
        <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" @click="dropdown = !dropdown">
            {{ $t("navbar.menu") }}
        </button>
        <div class="dropdown-menu" style="display:block !important" v-show="dropdown"  @click="dropdown = !dropdown">
            <span class="dropdown-item" @click="loadKicadProject">{{ $t("index.generateKicadBom") }}</span>
            <span class="dropdown-item" @click="loadEagleLib" >{{ $t("index.convertEaglelbrToLibKicad") }}</span>
            <span class="dropdown-item" @click="convertKicadPcbToFootPrint" >{{ $t("index.convertKicadPCBToFootprint") }}</span>
        </div>
        </div>
    </nav>

</template>

<script>
import { mapGetters, mapState } from 'vuex';
import navigation from '../vendor/navigation';

export default {
    data : function () {
        return {
            dropdown : false,
        }
    },
    methods :{
        goToHome : function(){
            navigation.forwardTo("/");
        },
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
            this.$store.dispatch('eagle_file/convertPcbToFootprint');
        },

    }
}
</script>