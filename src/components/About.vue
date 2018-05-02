<template>
  <div>
    <h2>Meraki Dashboard API Progressive Web App</h2>
    <p>This app explores a few of the Meraki API endpoints to demonstrate what's possible.</p>
    <p>The application is built using a VueJS frontend and a NodeJS backend. A Meraki API request handler has been written to proxy Meraki API requests.</p>

    <h3>More info</h3>
    <p>
    The app will first use an API key configured on the server, in this case a demo key. If a user applies their own API key in the advanced settings, then that key will be used. This application will save settings within the browser storage.
    </p>
    <p><b>Changes to the network will be applied!</b>.</p>
    <br>
    <h4>Under the hood</h4>
    <ul>
      <li>Meraki API NodeJS request handler</li>
      <li>Meraki API Axios Service</li>
      <li><a href="https://vuejs.org/">Vue.js</a></li>
      <li><a href="https://vuetifyjs.com/">Vuetify.js</a></li>
      <li><a href="https://www.chartjs.org/">Charts.js</a></li>
      <li><a href="https://nodejs.org/en/">Node.js</a></li>
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
