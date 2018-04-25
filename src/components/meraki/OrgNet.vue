<!-- Sets the Organization and Network state for the app -->
<template>
<div>
  <v-list> 
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-select 
          v-bind:items="orgs"
          item-text="name"
          item-value="id"
          return-object
          v-model="org"
          label="Organizations"
        ></v-select>
      </v-list-tile-content>
    </v-list-tile>
      <v-list-tile avatar>
      <v-list-tile-content>
        <v-select
          v-bind:items="nets"
          item-text="name"
          item-value="id"
          return-object
          v-model="net"
          label="Networks"
        ></v-select>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>

</div>
</template>

<script>

export default {
  data: function() {
    return {
      orgs: [],
      nets: [],
      org: {},
      net: {}
    }
  },
  computed: {
     apiKey: function () {
      return this.$store.state.apiKey;
    }
  },
  watch: {
    org () {
      // New org selected, fetch related networks
      this.fetchNets();
      this.$store.commit('setOrg', this.org);
    },
    net () {
      console.log('orgnet update state: net', this.net)
      this.$store.commit('setNet', this.net);
    },
    orgs () {
      this.fetchNets();
      this.$store.commit('setOrgs', this.orgs);
    },
    nets () {
      console.log('orgnet update state: net', this.nets)
      this.$store.commit('setNets', this.nets);
    },
    apiKey () {
      console.log('orgNet apiKey updated, fetching orgs')
      this.fetchOrgs();
    } 
  },
  created: function () {
    // Set default selections based on state
    this.orgs = this.$store.state.orgs;
    this.nets = this.$store.state.nets;
    this.org = this.$store.state.org;
    this.net = this.$store.state.net;
    this.fetchOrgs();
  },
  methods: {
    fetchOrgs: function(){
      this.orgs = [];
      this.$meraki.getOrganizations().then(res => this.orgs = res);
    },
    fetchNets: function(){
      this.nets = [];
      this.$meraki.getNetworks(this.org.id).then(res => this.nets = res);
    }
  }
};
</script>
<style>
.list {
    color: #0f0101;
}
</style>





