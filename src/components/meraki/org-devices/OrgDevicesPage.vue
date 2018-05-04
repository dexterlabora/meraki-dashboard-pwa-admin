<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>     
        <v-list>
          <v-list-group
            v-model="device.active"
            v-for="device in devices"
            :key="device.serial"
            :prepend-icon="mood"
            no-action
          >
            <v-list-tile slot="activator">
              <v-chip mb-2 :color="device.status == 'online' ? 'green':'red'">{{device.status}}</v-chip>
              <v-list-tile-content>
                <v-list-tile-title>{{device.name ? device.name : device.serial}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile @click="">
              <v-list-tile-content>
                <v-list-tile-title>{{ device.serial }}</v-list-tile-title>
                {{device.name}}
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon ripple :router="true" :to="{ name: 'deviceDetails', params: {device: device}}">
                  <v-icon>info</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            
          </v-list-group>
        </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
import DeviceDetails from "./DeviceDetails";
export default {
  components: {
    DeviceDetails
  },
  data: function() {
    return {
      devices: [],
      device: {},
    };
  },
  computed: {
    org() {
      return this.$store.state.org;
    }
  },
  watch: {
    org: function() {
      this.fetchOrgDevices(this.org.id);
    }
  },
  methods: {
    fetchOrgDevices: function() {
      if (!this.org) {
        return;
      }
      this.$meraki.getOrgDevices(this.org.id).then(res => {
        this.devices = res;
      });
    }
  },
  mounted: function() {
    this.fetchOrgDevices(this.org.id);
  }
};
</script>
<style>

</style>
