<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
    <v-card class="lic-card">
      <v-card-media height="100px">
        <v-card-text class="text-xs-center">
          <img src="/static/img/solutions_graphic_white.png" alt="logo"/>
        </v-card-text>
      </v-card-media>
      <v-card-title primary-title>
        
          <h3 class="headline mb-0">Welcome!</h3>
          <v-flex sm12>
            <p class="text-xs-left">
              <p>Use this app to manage your network with the Meraki API.</p>
              <hr>
              <br>
              <p>The demo uses the Meraki Sandbox to instantly start exploring the possibilities. </p> 
              <p>Use the Admin menu <i aria-hidden="true" class="material-icons icon">lock</i>  to use your own API key and turn on advanced features.</p>
              <p><a href="https://meraki.io">Meraki.io</a></p>
          </v-flex>
      </v-card-title>
    </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

export default {
  data: function() {
    return {
      // placeholder
    }
  }
}
</script>
<style>
.card__media img {
    width: 120px;
}

</style>
