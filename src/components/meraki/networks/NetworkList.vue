<template>
  <v-layout>
    <v-flex xs12 md8>
      <v-card v-if="networks[0]">
        <v-card-title primary-title>
          <h3>All Networks</h3>
        </v-card-title>
        <v-list three-line >
          <template v-for="network in networks">
            <v-list-tile  v-bind:key="network.id" :router="true" :to="{ name: 'networkDetails', params: {net: network}}" >
              <v-list-tile-content>
                <v-list-tile-title >{{network.name}}</v-list-tile-title>
                <v-list-tile-sub-title >
                  <strong>{{network.type}}</strong>    
                </v-list-tile-sub-title>
                <p class="body-1"> 
                    
                  <i>{{network.tags}}</i>
                </p>
              </v-list-tile-content>
            </v-list-tile>
          </template>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
    
</template>

<script>
  export default {
    props: ['networks'],
    data: function () {
      return {

      }
    }
    
  }

</script>
<style>

</style>
