<template>

<div>
      <v-btn icon  @click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-container grid-list-md >
        <v-layout row wrap>
            <v-flex sm12>
                <h2>{{client.description ? client.description : client.mac}}</h2>
            </v-flex>
            
            <v-flex sm12 md6>
                    <v-flex sm12 md11>
                            <i>Last Seen {{new Date(clientDetails.lastSeen*1000)}}</i>            
                        <v-list dense>
                            <v-subheader>Network Details</v-subheader>
                            <v-list-tile>
                                <v-list-tile-title>DHCP Hostname</v-list-tile-title>
                                <v-list-tile-sub-title>{{client.dhcpHostname}}</v-list-tile-sub-title>
                            </v-list-tile>
                            <v-list-tile v-if="clientDetails.os"> 
                                <v-list-tile-title>Operating System</v-list-tile-title>
                                <v-list-tile-sub-title>{{clientDetails.os}}</v-list-tile-sub-title>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-title>IP Address</v-list-tile-title>
                                <v-list-tile-sub-title>{{client.ip}} / {{client.ip6}}</v-list-tile-sub-title>
                            </v-list-tile>
                            <v-list-tile>
                                <v-list-tile-title>MAC Address</v-list-tile-title>
                                <v-list-tile-sub-title>{{client.mac}}</v-list-tile-sub-title>
                            </v-list-tile>
                            <v-list-tile  v-if="clientDetails.ssid">
                                <v-list-tile-title>SSID</v-list-tile-title>
                                <v-list-tile-sub-title>{{clientDetails.ssid}}</v-list-tile-sub-title>
                            </v-list-tile>
                            <v-list-tile  v-if="clientDetails.wirelessCapabilities">
                                <v-list-tile-title>Wireless Capabilities</v-list-tile-title>
                                <v-list-tile-sub-title>{{clientDetails.wirelessCapabilities}}</v-list-tile-sub-title>
                            </v-list-tile>
                            <v-list-tile  v-if="client.policy || client.policy.length > 0" two-line>
                                <v-list-tile-title>Policy</v-list-tile-title>
                                <v-list-tile-sub-title >{{ client.policy.type }} <b>  {{client.policy.name}}</b></v-list-tile-sub-title>
                            </v-list-tile>
                            <v-list-tile v-if="client.switchport">
                                <v-list-tile-title>Switchport</v-list-tile-title>
                                <v-list-tile-sub-title>{{client.switchport}}</v-list-tile-sub-title>
                            </v-list-tile>
                            <v-list-tile v-if="clientDetails.vlan"> 
                                <v-list-tile-title>VLAN</v-list-tile-title>
                                <v-list-tile-sub-title>{{clientDetails.vlan}}</v-list-tile-sub-title>
                            </v-list-tile>
                        </v-list>

                    </v-flex>

                </v-flex>
                <v-flex pt-2>
                    <gmap-map :center="map" :zoom="15" map-type-id="terrain" style="width: 400px; height: 400px">
                        <gmap-marker :key="client.device.serial" :position="map" />
                    </gmap-map>
                    <v-flex sm12 md12>
                        <p><b>Network Device: </b>{{client.device.name}}</p> 
                        <p><b>IP: </b>{{client.device.lanIp}}</p>
                    </v-flex>
                </v-flex>

            <v-flex sm12 md12>
                <client-usage-history :netId="client.device.networkId" :client="client.mac"></client-usage-history>
            </v-flex>
            
        </v-layout>
        </v-container>
</div>
</template>

<script>
import ClientUsageHistory from "./ClientUsageHistory";
export default {
  props: ["client"],
  components: {
    ClientUsageHistory
  },
  data: function() {
    return {
      clientDetails: {}
    };
  },
  methods: {
    fetchClient() {
      this.$meraki
        .getClient(this.client.device.networkId, this.client.mac)
        .then(res => {
          this.clientDetails = res;
        });
    }
  },
  computed: {
    map() {
      return {
        lat: this.client.device.lat,
        lng: this.client.device.lng
      };
    }
  },
  mounted() {
    this.fetchClient();
  }
};
</script>
