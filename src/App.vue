<template>
  <div>
      <NavBar /> 

      <!-- route outlet -->
      <!-- component matched by the route will render here -->
      <router-view></router-view>

      <Modal />
      <Preloader />
  </div>

</template>

<script>
import NavBar from './components/navbar.vue';
import Modal from './components/modal.vue';
import Preloader from './components/preloader.vue';

export default {
    computed:{

    },
    components : {
        NavBar,
        Modal,
        Preloader
    }
}
</script>