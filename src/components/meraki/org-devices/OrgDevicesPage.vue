<template>
  <v-layout>
    <v-flex xs12 md6>
      <v-card>
        <v-card-title primary-title>
          <h3>All Devices</h3>
        </v-card-title>

            <v-list two-line subheader>
            <v-subheader inset>Devices</v-subheader>
            <v-list-tile avatar v-for="device in devices" :key="device.serial" >
              <v-list-tile-avatar>
                <v-chip mb-2 :color="device.status == 'online' ? 'green':'red'">{{device.status}}</v-chip>
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title >{{device.name ? device.name : device.serial}}</v-list-tile-title>
                <v-list-tile-sub-title v-if="device.wan1Ip">WAN1 IP: {{ device.wan1Ip }}</v-list-tile-sub-title>
                <v-list-tile-sub-title v-if="device.wan2Ip">WAN2 IP: {{ device.wan2Ip }}</v-list-tile-sub-title>
                <v-list-tile-sub-title v-if="device.publicIp">Public IP: {{ device.publicIp }}</v-list-tile-sub-title>
                <v-list-tile-sub-title v-if="device.lanIp">LAN IP: {{ device.lanIp }}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn @click.stop="dialog = true">
                  <v-icon color="grey lighten-1">info</v-icon>
                  </v-btn>
              </v-list-tile-action>
              <v-dialog 
              v-model="dialog" 
              max-width="500px"
              hide-overlay
              >
                <device-details :device="device" v-if="dialog"></device-details>        
              </v-dialog>
            </v-list-tile>
        </v-list>
      </v-card>
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
      dialog: false
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
