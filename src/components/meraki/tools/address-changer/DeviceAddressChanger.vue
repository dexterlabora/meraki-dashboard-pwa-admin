<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card class="dev-card">
        <v-card-title primary-title>
          <h2>Meraki Starter Template</h2>
        </v-card-title>
        <v-card-text>
          {{yourData}}
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
    
</template>

<script>
export default {
  data: function() {
    return {
      licenses: {}
    };
  },
  computed: {
    org() {
      return this.$store.state.org;
    },
    net() {
      return this.$store.state.net;
    }
  },
  watch: {
    org: function() {
      this.fetchLicenses();
    }
  },
  methods: {
    // functions to interact with API or other features
  },
  created: function() {
    // Run a functino at the start
  }
};
</script>
<style>
.dev-card {
  max-width: 400px;
}
</style>
