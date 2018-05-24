// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import axios from 'axios'
import VueAxios from 'vue-axios'
import MerakiService from "./services/meraki-service";
import Meraki from "meraki-service";
import VueCharts from 'vue-chartjs'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueLodash from 'vue-lodash'
import 'material-design-icons-iconfont/dist/material-design-icons.css'


const options = { name: 'lodash' }

Vue.use(VueLodash, options)

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDG1VII_DIeeM6uGUjHmGp_LamDuQdY1ZU'
  }
})

import { eventHub } from './eventhub';

// built-in service
// Vue.prototype.$meraki  = new MerakiService('', '/api', eventHub);

// external service
Vue.prototype.$meraki  = new Meraki('','/api',);



Vue.use(VueMoment, { moment })
Vue.use(Vuex)
Vue.use(Vuetify)
Vue.use(VueAxios, axios)


Vue.config.productionTip = false

//const meraki = new MerakiService('be647eed3046542a895ea9ad07b7f7cef4c002de', '/api')

const store = new Vuex.Store({
	state: {
    org: {},
    orgs: [],
    net: {},
    nets: [],
    apiKey: '',
    adminMode: false
  },
  mutations: {
    setOrg: (state, payload) => state.org = payload,
    setOrgs: (state, payload) => state.orgs = payload,
    setNet: (state, payload) => state.net = payload,
    setNets: (state, payload) => state.nets = payload,
    setApiKey: (state, payload) => state.apiKey = payload,
    setAdminMode: (state, payload) => state.adminMode = payload
  },
  plugins: [createPersistedState()]
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})


