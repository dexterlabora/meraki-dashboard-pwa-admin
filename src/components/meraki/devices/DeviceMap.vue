<template>
    <div class="card card-map">
      <div class="header">
        <h4 class="title">Google Maps</h4>
      </div>
      <div class="map">
        <div id="map"></div>
      </div>
    </div>
</template>
<script>
  export default {
    data () {
      return {
        devices: [],
        markers: []
      }
    },
    created: function () {
      this.fetchDevices();
    },
    computed:{
      net () {
        console.log("state net: ",this.$store.state.net);
        return this.$store.state.net
      }
    },
    watch: {
      net: function () {
        this.fetchDevices();
      },
      devices: function (){
        this.updateMarkers();
      }
    },
    methods: {
      fetchDevices: function () {
        if(!this.net){
          return;
        }
        var url = '/api/networks/'+this.net.id+'/devices';
        this.$http.get(url)
          .then(res => {
            this.devices = res.body;
            console.log('fetching devices',this.ssids);
          }, err => {
            console.log('error getting devices',err);
          });
      },
      updateMarkers: function () {
        var bounds = new google.maps.LatLngBounds();
        var infowindow = new google.maps.InfoWindow();
        var mapOptions = {
          zoom: 8,
          scrollwheel: false, // we disable de scroll over the map, it is a really annoing when you scroll through page
          styles: [{
              'featureType': 'water',
              'stylers': [{ 'saturation': 43 }, { 'lightness': -11 }, { 'hue': '#0088ff' }]
            }, {
              'featureType': 'road',
              'elementType': 'geometry.fill',
              'stylers': [{ 'hue': '#ff0000' }, { 'saturation': -100 }, { 'lightness': 99 }]
            }, {
              'featureType': 'road',
              'elementType': 'geometry.stroke',
              'stylers': [{ 'color': '#808080' }, { 'lightness': 54 }]
            }, {
              'featureType': 'landscape.man_made',
              'elementType': 'geometry.fill',
              'stylers': [{ 'color': '#ece2d9' }]
            }, {
              'featureType': 'poi.park',
              'elementType': 'geometry.fill',
              'stylers': [{ 'color': '#ccdca1' }]
            }, {
              'featureType': 'road',
              'elementType': 'labels.text.fill',
              'stylers': [{ 'color': '#767676' }]
            }, {
              'featureType': 'road',
              'elementType': 'labels.text.stroke',
              'stylers': [{ 'color': '#ffffff' }]
            }, { 'featureType': 'poi', 'stylers': [{ 'visibility': 'off' }] }, {
              'featureType': 'landscape.natural',
              'elementType': 'geometry.fill',
              'stylers': [{ 'visibility': 'on' }, { 'color': '#b8cb93' }]
            }, { 'featureType': 'poi.park', 'stylers': [{ 'visibility': 'on' }] }, {
              'featureType': 'poi.sports_complex',
              'stylers': [{ 'visibility': 'on' }]
            }, { 'featureType': 'poi.medical', 'stylers': [{ 'visibility': 'on' }] }, {
              'featureType': 'poi.business',
              'stylers': [{ 'visibility': 'simplified' }]
            }]
        }
        var map = new window.google.maps.Map(document.getElementById('map'), mapOptions)

        // create map markers for each device
        this.devices.forEach((device) => {
          const position = new google.maps.LatLng(device.lat, device.lng);
          const marker = new google.maps.Marker({
            position,
            map,
            title: device.name
          });
          console.log("add marker: ",marker);
          // event listener
          google.maps.event.addListener(marker, 'click', (function(marker, device) {
            return function() {
              var html = "<h2>"+device.name+"</h2><p>"+device.mac+"</p>"
              infowindow.setContent(html);
              infowindow.open(map, marker);
            }
          })(marker, device));

          bounds.extend(marker.position);
          //now fit the map to the newly inclusive bounds
          map.fitBounds(bounds);
          marker.setMap(map)

        });
      }
    },
    mounted () {
      // Get Meraki Devices
      this.fetchDevices()
    }
  }

</script>
<style>

</style>
