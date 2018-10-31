<template>

    <main role="main" class="container" id="main">

        <div >
            <div class="row">
                <div class="col-md-6" id="symbolDiv" style="border:1px solid #CCCCCC">
                    <mySymbol :dataIn="symbols" container="symbolDiv" factor="5" export="true"/>
                </div>
                <div class="col-md-6" id="footprintDiv" style="border:1px solid #CCCCCC">
                    <mySymbol :dataIn="packages" container="footprintDiv" factor="30" export="false"/>
                </div>
            </div>
        </div>
    </main>

</template>

<script>
import { mapGetters, mapState } from 'vuex'
import mySymbol from '../components/mySymbol.vue'
const {dialog} = require('electron').remote;

export default {
    computed:{
        ...mapGetters('eagle_file' , {
            symbols : 'symbols',
            packages : 'packages'
        })
    },
    methods:{
        
    },
    components : {
        mySymbol
    },
}
</script>