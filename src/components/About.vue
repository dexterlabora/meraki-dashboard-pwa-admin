<template>
  <div>
    <h2>Meraki API Demo App</h2>
    <p>This web app explores a few of the Meraki API endpoints to demonstrate what's possible.</p>
    <p>The application is built using a VueJS frontend and a NodeJS backend. A Meraki API request handler has been written to proxy Meraki API requests.</p>

    <h3>More info</h3>
    <p>
    The app will first use an API key configured on the server, in this case a demo key. If a user applies their own API key in the advanced settings, then that key will be used. This application is stateless and will lose all settings onced closed. 
    </p>
    <p><b>Changes to the network will be applied!</b>.</p>
    <br>
    <h4>Under the hood</h4>
    <ul>
      <li>Meraki API request handler</li>
      <li>Vue.js 2</li>
      <li>Vue Router</li>
      <li>Vuetify.js</li>
      <li>Charts.js</li>
      <li>Node.js</li>
    </ul>
  </div>
</template>

<script>
module.exports = {
  data: function() {
    return {
      
    }
  }
}
</script>
