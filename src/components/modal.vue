<template>
    <div>
        <div class="modal fade show" tabindex="-1" role="dialog" style="display:block" v-show="modal.title">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ modal.title }}</h5>
                        <button type="button" @click="close" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>{{ modal.string }}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="close">OK</button>
                    </div>
                </div>
            </div>

        </div>

        <div class="modal-backdrop fade show" v-show="modal.title"></div>
    </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
    computed:{
        ...mapGetters('modal' , {
            modal : 'data'
        }),
       
    },
    methods: {
        close () {
            this.$store.dispatch('modal/pop');
        }
    },
}
</script>