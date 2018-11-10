

import Vue from 'vue';
import App from './App.vue';
import store from './store'

import indexPage from './pages/index.vue';
import bomPage from './pages/bom.vue';
import eagleSymbolPage from './pages/eagleLib.vue';
import convertPcbToFootprint from './pages/convertPcbToFootprint.vue'
import VueRouter from 'vue-router';
import VuexI18n from 'vuex-i18n';

const app = require('electron').remote.app;

Vue.use(VuexI18n.plugin, store);
Vue.use(VueRouter);

// 2. Define some routes
// Each route should map to a component. The "component" can
// either be an actual component constructor created via
// `Vue.extend()`, or just a component options object.
// We'll talk about nested routes later.
const routes = [
  { path : '/' , component : indexPage },
  { path : '/bom' , component : bomPage },
  { path : '/eagleSymbol' , component : eagleSymbolPage },
  { path : '/convertPcbToFootprint' , component : convertPcbToFootprint },
  { path : '*' , redirect : "/"},
]
  
// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  mode: 'hash',
  routes // short for `routes: routes`
})

const langue = ['fr' , 'en'];

langue.map((lang ) => {

  let l = require('./i18n/' + lang + '.json');

  Vue.i18n.add(lang, Object.assign({}, l));

});

// set the start locale to use
Vue.i18n.set(app.getLocale());
Vue.i18n.set('en');


// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
new Vue({
  el: '#app',
  store,
  router,
  render : h => h ( App )
})
