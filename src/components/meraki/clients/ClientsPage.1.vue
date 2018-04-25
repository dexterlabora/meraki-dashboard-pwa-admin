<template>
<div>
    <h2>Clients</h2>
     <v-btn @click="onGetApiKey()">Get API Key</v-btn>
     <v-btn @click="onSetApiKey()">Set API Key</v-btn>
     <v-text-field
        v-model="apiKey"
        label="API Key"
    ></v-text-field>
    <div>
      <v-text-field
        v-model="netId"
        label="Pre-shared key"
      ></v-text-field>

      <v-btn @click="onGetClientsForNetwork()">Get Clients for Network</v-btn> 
      <div v-if="clients">
        <ul>
          <li v-for="c in clients" :key="c.mac">{{c.dhcpHostname}} {{c.policies.type}}</li>
        </ul>
      </div>
    </div>
  
</div>
</template>

<script>

export default {
  components: {

  },
	data: function() {
		return {
      clients: [],
      netId: 'L_646829496481098845',
      apiKey: '',
      settings: {}
    };
  },
  methods: {
    onGetClientsForNetwork() {
      this.$meraki.getClientsForNetwork(this.netId, 86400).then(res => {
        this.clients = res;
      });
    },

    onGetApiKey() {
      this.apiKey = this.$meraki.apiKey;
    },

    onSetApiKey() {
      this.$meraki.apiKey = this.apiKey;
    }
  }
}
</script>
