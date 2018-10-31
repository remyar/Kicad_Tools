index<template>
    <div>
        <div :id="'canvas' + container" ></div>

        <div class="form-group">
            <div class="row">
                <div class="col-md-8">
                    <select class="form-control" @change="onSymbolChange">
                        <option v-for="(symbol , index) in dataIn" :key="index" >{{ symbol.name }}</option > 
                    </select>
                </div>
                <div class="col">
                        <button type="button" class="form-control btn btn-primary" @click="exportToKicad" v-show="displayExport" >Export</button>
                </div>
            </div>



        </div>

    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import eagle from '../vendor/eagle';

let selectedId = 0;
export default {
    props : ['dataIn' , 'container' , 'factor' , 'export'],
    data : function(){
            return {
            container : this.container,
            displayExport : (this.export == "true") ? true : undefined,
        }
    },
    computed:{
  
    },
    methods:{
        exportToKicad(ev){
            this.$store.dispatch( 'eagle_file/exportToFile' , { data : this.dataIn[selectedId] } );
        },
        onSymbolChange(ev){
            selectedId = ev.target.selectedIndex;
            eagle.draw('canvas'+this.container , this.dataIn, selectedId, this.factor);
        },
        init(){
            let _self = this;
            let canvas = document.getElementById('canvas'+this.container);
            let el = document.getElementById(this.container);
            canvas.width = el.clientWidth - 30;
            canvas.height = window.innerHeight-56*3;

            window.addEventListener("resize", function(ev) {
                let el2 = document.getElementById(_self.container);
                canvas.width = el2.clientWidth - 30;
                canvas.height = window.innerHeight-56*3;

                eagle.draw('canvas'+_self.container, _self.dataIn , selectedId , _self.factor);
            })
        },
        draw(){
            eagle.draw('canvas'+this.container , this.dataIn, selectedId, this.factor);
        }
    },
    components : {
    },
    mounted(){
        this.init();
        this.draw();
    }
}
</script>