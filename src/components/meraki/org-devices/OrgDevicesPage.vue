<template>
  <v-layout>
    <v-flex xs12 md6>
      <v-card>
        <v-card-title primary-title>
          <h3>All Devices</h3>
        </v-card-title>

            <v-list two-line subheader>
            <v-subheader inset>Devices</v-subheader>
            <v-list-tile avatar v-for="device in devices" :key="device.serial" @click="">
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
                <v-btn icon ripple>
                  <v-icon color="grey lighten-1">info</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <!--<v-list-tile  v-bind:key="device.serial" :router="true" :to="{ name: 'deviceDetails', params: {device}}" >
              <v-list-tile-content>
                <v-list-tile-title >{{device.name ? device.name : device.serial}}</v-list-tile-title>
                <v-list-tile-sub-title mb-5>
                  <v-flex xs12>
                     v-chip :text-color="'red': device.status != 'online', 'green': device.status == 'online'">{{device.status}}</v-chip 
                     <v-chip mb-2 :color="device.status == 'online' ? 'green':'red'">{{device.status}}</v-chip>
                  </v-flex>           
                </v-list-tile-sub-title>

                <p class="body-1"> 
                  <i v-if="device.wan1Ip">WAN1 IP: {{device.wan1Ip}}</i>
                  <i v-if="device.wan2Ip">WAN2 IP: {{device.wan2Ip}}</i>
                  <i v-if="device.publicIp">Public IP: {{device.publicIp}}</i>
                  <i v-if="device.lanIp">LAN IP: {{device.lanIp}}</i>
                </p>
              </v-list-tile-content>
            </v-list-tile>-->

        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
    
</template>

<script>
  export default {
    data: function () {
      return {
        devices: [] 
      }
    },
    computed: {
      org () {
        return this.$store.state.org;
      }
    },
    watch: {
      org: function(){
        this.fetchOrgDevices(this.org.id);
      }
    },
    methods: {
      fetchOrgDevices: function () {
        if(!this.org){
          return;
        }
        this.$meraki.getOrgDevices(this.org.id).then(res => {
          this.devices = res;
        })
      }
    },
    mounted: function () {
      this.fetchOrgDevices(this.org.id);
    },
  }

</script>
<style>

</style>
