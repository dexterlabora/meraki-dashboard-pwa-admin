<template>

    <v-card>
      <v-btn icon  @click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-btn>
        <v-layout row wrap>
            <v-flex sm12 md6>
                <v-card-title><h2>{{device.name ? device.name : device.serial}}</h2></v-card-title>
                <v-card-text>
                    <v-chip mb-2 :color="device.status == 'online' ? 'green':'red'">{{device.status}}</v-chip>
                    <v-list>
                        <v-list-tile>
                            <v-list-tile-title>Serial</v-list-tile-title>
                            <v-list-tile-sub-title>{{device.serial}}</v-list-tile-sub-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>WAN 1 IP</v-list-tile-title>
                            <v-list-tile-sub-title>{{device.wan1Ip}}</v-list-tile-sub-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>WAN 2 IP</v-list-tile-title>
                            <v-list-tile-sub-title>{{device.wan2Ip}}</v-list-tile-sub-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>Public IP</v-list-tile-title>
                            <v-list-tile-sub-title>{{device.publicIp}}</v-list-tile-sub-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>LAN IP</v-list-tile-title>
                            <v-list-tile-sub-title>{{device.lanIp}}</v-list-tile-sub-title>
                        </v-list-tile>
                        <v-list-tile>
                            <v-list-tile-title>Model</v-list-tile-title>
                            <v-list-tile-sub-title>{{deviceDetails.model}}</v-list-tile-sub-title>
                        </v-list-tile>
                    </v-list>
                </v-card-text>
                <!--v-card-actions>
                    <v-list>
                        <v-list-tile>
                            <v-btn flat color="orange">EDIT</v-btn>
                        </v-list-tile>
                    </v-list>
                </v-card-actions -->
            </v-flex>
            <v-flex pt-2>
                <gmap-map :center="map" :zoom="15" map-type-id="terrain" style="width: 500px; height: 400px">
                    <gmap-marker :key="device.serial" :position="map" />
                </gmap-map>
    
            </v-flex>
        </v-layout>
    
    </v-card>
</template>

<script>
    export default {
        props: ["device"],
        data: function() {
            return {
                deviceDetails: {}
            };
        },
        methods: {
            fetchDevice() {
                this.$meraki
                    .getDevice(this.device.networkId, this.device.serial)
                    .then(res => {
                        this.deviceDetails = res;
                    });
            }
        },
        computed: {
            net() {
                return this.$store.state.net;
            },
            map() {
                return {
                    lat: this.deviceDetails.lat,
                    lng: this.deviceDetails.lng
                };
            }
        },
        mounted() {
            this.fetchDevice();
        }
    };
</script>
