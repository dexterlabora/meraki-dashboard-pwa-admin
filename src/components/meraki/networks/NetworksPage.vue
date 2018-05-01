<template>
<div>
    <h2>Networks</h2>
    <v-btn fab fixed bottom right dark color="primary" :router="true" :to="{ name: 'createNetwork'}">
      <v-icon dark>add</v-icon>
    </v-btn>
    <network-list :networks="nets"></network-list>

</div>
</template>

<script>
import NetworkList from "./NetworkList.vue";
export default {
  components: {
    NetworkList
  },
  data: function() {
    return {
      nets: []
    };
  },
  computed: {
    org() {
      return this.$store.state.org;
    }
  },
  watch: {
    org: function() {
      this.fetchNetworks();
    }
  },
  methods: {
    fetchNets: function(){
      this.nets = [];
      this.$meraki.getNetworks(this.org.id).then(res => {
        this.nets = res
      });
    }
  },
  mounted: function() {
    this.fetchNets();
  }
};
</script>
