<template>
            <v-card>
                <v-card-title>{{device.name ? device.name : device.serial}}</v-card-title>
                <v-card-text>
                    <v-chip mb-2 :color="device.status == 'online' ? 'green':'red'">{{device.status}}</v-chip>
                    <v-list>
                        <v-list-tile>
                            Serial: {{device.serial}}
                        </v-list-tile>
                        <v-list-tile>
                            WAN1 IP: {{device.wan1Ip}}
                        </v-list-tile>
                        <v-list-tile>
                            WAN2 IP: {{device.wan2Ip}}
                        </v-list-tile>
                        <v-list-tile>
                            Public IP: {{device.publicIp}}
                        </v-list-tile>
                        <v-list-tile>
                            LAN IP{{device.lanIp}}
                        </v-list-tile>
                        <v-list-tile>
                            Model: {{deviceDetails.model}}
                        </v-list-tile>
                        <v-list-tile v-if="deviceDetails">
                            Location: <a :href="map" target="_blank">Google Map</a>
                        </v-list-tile>
                    </v-list>
                </v-card-text>
                <v-card-actions>
                    <v-list>
                        <v-list-tile>
                            <v-btn flat color="orange">EDIT</v-btn>
                        </v-list-tile>
                    </v-list>
                </v-card-actions>
            </v-card>
        
</template>

<script>
export default {
    props: ['device'],
    data: function () {
      return {
        deviceDetails: {}
      }
    },
    methods: {
        fetchDevice(){
            this.$meraki.getDevice(this.device.networkId, this.device.serial).then(res => {
                this.deviceDetails = res;
            });
        }
    },
    computed: {
      net () {
        return this.$store.state.net;
      },
      map () {
          return "http://maps.google.com/maps?z=12&t=m&q=loc:"+this.device.lat+"+"+this.device.lng;
      }
    },
    mounted (){
        this.fetchDevice();
    }
}
</script>
