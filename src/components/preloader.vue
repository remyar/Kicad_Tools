<template>
    <div>
        <div class="modal fade show" tabindex="-1" role="dialog" style="display:block" v-show="show">
            <div class="container-fluid">
                <div class="row">
                <div class="text-center">  
                    <div class="animationload">
                        <div class="osahanloading"></div>
                    </div>
                </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show" v-show="show"></div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
    computed:{
        ...mapGetters('preloader' , {
            show : 'show'
        }),
       
    },
}
</script>