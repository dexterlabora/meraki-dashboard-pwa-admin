<template>
  <v-app id="app">
    <v-snackbar
      :timeout="3000"
      top
      multi-line
      :color="snackbar.color"
      v-model="snackbar.active"
      >
      <h3>{{ snackbar.status }}</h3>
      {{ snackbar.text }}
      <v-btn flat color="white" @click.native="snackbar.active = false">Close</v-btn>
    </v-snackbar>
    
    <v-toolbar :color="!adminMode ? 'success' : 'warning'">
      <v-toolbar-side-icon @click.native.stop="showNav = !showNav"></v-toolbar-side-icon>
      <v-spacer></v-spacer>
      <v-toolbar-title class="white--text">Meraki Vue Tools</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items >
        <settings></settings> 
      </v-toolbar-items>     
    </v-toolbar>

   
      <v-navigation-drawer v-model="showNav" left temporary absolute drawer >
       
        <v-list>
          <org-net></org-net>
          
          <v-list-tile :router="true" :to="{ name: 'home'}">
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile>

          <v-list-tile :router="true" :to="{ name: 'wireless'}">
            <v-list-tile-title>Wireless</v-list-tile-title>
          </v-list-tile>
            
          <v-list-tile :router="true" :to="{ name: 'licenses'}" v-if="adminMode">
            <v-list-tile-title>Licenses</v-list-tile-title>
          </v-list-tile>
                
          <v-list-tile :router="true" :to="{ name: 'inventory'}" v-if="adminMode">
            <v-list-tile-title>Inventory</v-list-tile-title>
          </v-list-tile>
                
          <v-list-tile :router="true" :to="{ name: 'devices'}" v-if="adminMode">
            <v-list-tile-title>Devices</v-list-tile-title>
          </v-list-tile>

          <v-list-tile :router="true" :to="{ name: 'networks'}" v-if="adminMode">
            <v-list-tile-title>Networks</v-list-tile-title>
          </v-list-tile>

          <v-list-tile :router="true" :to="{ name: 'traffic'}">
            <v-list-tile-title>Traffic</v-list-tile-title>
          </v-list-tile>

          <v-list-tile :router="true" :to="{ name: 'clients'}">
            <v-list-tile-title>Clients</v-list-tile-title>
          </v-list-tile>

          <v-list-tile :router="true" :to="{ name: 'orgDevices'}">
            <v-list-tile-title>Device Status | Org-Wide</v-list-tile-title>
          </v-list-tile>

          <v-list-tile :router="true" :to="{ name: 'pii'}" v-if="adminMode">
            <v-list-tile-title>PII</v-list-tile-title>
          </v-list-tile>

          <v-list-tile :router="true" :to="{ name: 'ssids'}" v-if="adminMode">
            <v-list-tile-title>SSIDs</v-list-tile-title>
          </v-list-tile>

          <v-list-tile :router="true" :to="{ name: 'about'}">
            <v-list-tile-title>About</v-list-tile-title>
          </v-list-tile>
          
        </v-list>
      </v-navigation-drawer>
      <v-content>
        <v-container>
          <pulse-loader class="loader" :loading="loading" color="green" size="20px"></pulse-loader>
          <router-view class="view"></router-view>
        </v-container>
      </v-content>
    <v-footer>
      <div class="text-xs-right"><small>Build with the Meraki API - <a href="https://create.meraki.io/" target="_blank">Create.Meraki.io</a></small></div>
    </v-footer>
  </v-app>
</template>

<script>
import OrgNet from "./components/meraki/OrgNet.vue";
import Settings from "./components/Settings.vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import { eventHub } from "./eventhub";

export default {
  components: {
    "org-net": OrgNet,
    settings: Settings,
    "pulse-loader": PulseLoader
  },
  data: function() {
    return {
      showNav: false,
      loading: false,
      snackbar: {
        active: false,
        color: "",
        mode: "",
        text: ""
      }
    };
  },
  watch: {
    showNav: function() {
      console.log("showNav", this.showNav);
    },
    apiKey: function() {
      // update all Meraki API calls with the new API key header
      console.log("updating global axios defaults ", this.apiKey);
      this.axios.defaults.headers.common[
        "X-Cisco-Meraki-API-Key"
      ] = this.apiKey;
      this.$meraki.apiKey = this.apiKey;
    },
    loading: function() {
      this.$store.commit("setLoading", this.loading);
    }
  },
  computed: {
    adminMode: function() {
      return this.$store.state.adminMode;
    },
    apiKey: function() {
      return this.$store.state.apiKey;
    }
  },
  methods: {
    notify(status, text) {
      this.snackbar.text = text;
      this.snackbar.color = status;
      this.snackbar.active = true;
    },
    initMeraki() {
      this.$meraki.apiKey = this.apiKey;
      console.log(
        "initMeraki this.$meraki.meraki.interceptors",
        this.$meraki.meraki.interceptors
      );

      this.$meraki.meraki.interceptors.request.use(
        conf => {
          eventHub.$emit("before-request");
          this.loading = true;
          return conf;
        },
        error => {
          eventHub.$emit("request-error");
          this.loading = false;
          this.notify("error", error);
          return Promise.reject(error);
        }
      );
      this.$meraki.meraki.interceptors.response.use(
        response => {
          eventHub.$emit("after-response");
          this.loading = false;
          // notify on changes made
          console.log("App inerceptor response", response);
          let method = response.config.method || "";
          if (["post", "put", "delete"].indexOf(response.config.method) >= 0) {
            this.notify("success", "Changes Saved!");
          }
          return response;
        },
        error => {
          eventHub.$emit("response-error");
          this.loading = false;
          this.notify("error", error);
          return Promise.reject(error);
        }
      );
      console.log(
        "initMeraki this.$meraki.meraki.interceptors UPDATED",
        this.$meraki.meraki.interceptors
      );
    }
  },
  created: function() {
    this.initMeraki();
  },
  beforeDestroy: function() {
    eventHub.$off("meraki-loading", loading => (this.loading = loading));
  }
};
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.loader {
  position: fixed;
  top: 30%;
  left: 50%;
  margin-top: -50px;
  margin-left: -100px;
}
</style>
