<template>

    <main role="main" class="container">
        <br>

        <div class="row">
            <div class="col">
                Identification
            </div>

                <div class="col-md-2">
                   Valeur
                </div>
<!--
                <div class="col text-truncate">
                    Empreinte
                </div>
-->
                <div class="col-md-1">
                    Quantité
                </div>
                <div class="col">
                    Référence fabricant
                </div>

                <div class="col">
                    Prix Unitaire
                </div>
                <div class="col">
                    Prix Total
                </div>
<!--
                <div class="col">
                    Ref Digikey
                </div>
                <div class="col">
                    Ref Mouser
                </div>
-->
            </div>

        <div v-for="(values, key) in components" :key="key">
            <div class="row">
                <div class="col componentKey">
                    <b>{{ key }}</b>
                </div>
            </div>
            <div class="row component" v-for="value in values" :key="value.val">
                <div class="col-md-2">
                    <span v-for="ref in value.refs " :key="ref">
                        {{ ref }}
                    </span>
                </div>

                <div class="col-md-2">
                    {{ value.val }}
                </div>
<!--
                <div class="col text-truncate">
                    {{ value.footprint }}
                </div>
-->
                <div class="col-md-1 text-center">
                    {{ value.nbRefs }}
                </div>

                <div class="col">
                    {{ value.mfrnum }}
                </div>
                <div class="col">
                    {{ value.unitPrice }}
                </div>
                <div class="col">
                    {{ value.totalPrice }}
                </div>
<!--
                <div class="col">
                    <a :href="'https://www.digikey.fr/products/fr?keywords=' + value.digikey " v-show="value.digikey" >digikey</a>
                </div>
                
                <div class="col">
                    {{ value.mouser }}
                </div>
-->
            </div>
            <br>
        </div>
        <br>

        <div class="row">
            <div class="col-md-3">
        <button type="button" class="form-control btn btn-primary" @click="printPDF">{{ $t("save.asPDF") }}</button>
                </div>
        </div>
<br><br>
    </main>

</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
    computed:{
        ...mapGetters('kicad_file' , {
            components : 'components',
            project : 'project'
        })
    },
    methods : {
        printPDF : function(ev){
            this.$store.dispatch('export_pdf/save', { components : this.components , project : this.project} );
        }
    },
    components : {
    }
}
</script>