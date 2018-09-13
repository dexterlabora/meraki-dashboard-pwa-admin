<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card class="dev-card">
        <v-card-title primary-title>
          <h2>Device Counts</h2>
        </v-card-title>
        <v-card-text>
          <v-list two-line subheader>
            <template v-for="(count, device) in licenses.licensedDeviceCounts">
              
              <v-list-tile :key="device">
                <v-list-tile-content>
                  <v-list-tile-title>{{device}}</v-list-tile-title>
                  <v-list-tile-sub-title>{{count}}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
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
    }
  },
  watch: {
    org: function() {
      this.fetchLicenses();
    }
  },
  methods: {
    fetchLicenses: function() {
      if (!this.org) {
        return;
      }

      this.$meraki.getLicenseState(this.org.id).then(
        res => {
          this.licenses = res;
        },
        err => {
          console.log("error getting inventory", err);
        }
      );
    }
  },
  created: function() {
    this.fetchLicenses();
  }
};
</script>
<style>
.dev-card {
  max-width: 400px;
}
</style>
