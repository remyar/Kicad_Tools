<template>
  <div>
      <NavBar /> 

      <!-- route outlet -->
      <!-- component matched by the route will render here -->
      <router-view></router-view>

      <Modal />
  </div>

</template>

<script>
import NavBar from './components/navbar.vue';
import Modal from './components/modal.vue';

export default {
    computed:{

    },
    components : {
        NavBar,
        Modal
    }
}
</script>