<template>
<div>
    <v-snackbar
      :timeout="3000"
      top
      multi-line
      :color="snackbar.color"
      v-model="snackbar.active"
      >
      <h3>{{ snackbar.status }}</h3>
      {{ snackbar.text }}
      <v-btn flat color="white" @click.native="snackbar.active = false">Close</v-btn>
    </v-snackbar>
    <h2>Clients in Network</h2>    
    <h4>{{net.name}}</h4>
    <v-container fluid>
      <v-layout row wrap>    
        <v-flex xs6>    
          <v-select
              :items="timespanOptions"
              v-model="timespan"
              label="Timespan"
              single-line
            ></v-select>
        </v-flex>
            <v-flex xs6>
              <v-btn color="primary" @click="onGetClientsForNetwork()">Get Clients</v-btn>
              
            </v-flex>     
        <v-flex xs12>
          <clients-table 
          :items="clientsPolicyNames" 
          :loading="loading" 
          :policies="policies" 
          @policySelected="onPolicySelected($event)" 
          @clientsSelected="onClientsSelected($event)"
          />
        </v-flex>
        <v-flex xs12>
          <p v-if="loading"><i>This report could take some time if you have lots of devices or a long timespan. Coffee break?</i></p>
          <p><i>If you are curious what's going on, open the browser console to see the script in action.</i></p>
        </v-flex>
      </v-layout>
    </v-container>
</div>
</template>

<script>
import ClientsTable from "./ClientsTable.vue";
export default {
  components: {
    ClientsTable
  },
  mounted: function() {
    this.getPolicies();
    this.onGetClientsForNetwork();
  },
  data: function() {
    return {
      snackbar : {
        active: false,
        color: '',
        mode: '',
        text: ''
      },
      policy: {},
      policies: [],
      deviceType: 'MR',
      clients: [],
      clientsSelected: [],
      loading: false,
      timespan: "3600",
      timespanOptions: [
        { text: "1 Hour", value: 3600 },
        { text: "12 Hours", value: 43200 },
        { text: "1 Day", value: 86400 },
        { text: "1 Week", value: 604800 },
        { text: "1 Month", value: 2592000 }
      ]
    };
  },
  computed: {
    net() {
      return this.$store.state.net;
    },
    clientsPolicyNames() {
      let newClients = [];
      if (!this.clients) {
        return;
      }
      this.clients.forEach(c => {
        this.policies.forEach(p => {
          if (c.policy.groupPolicyId) {
            if (p.groupPolicyId == c.policy.groupPolicyId) {
              c.policy.name = p.name;
            }
          }
        });
        newClients.push(c);
      });
      return newClients;
    }
  },
  watch: {
    net: function() {
      // refesh policy list
      this.getPolicies();
    }
  },
  methods: {
    onGetClientsForNetwork() {
      this.clients = []; // clear list
      this.loading = true;
      this.$meraki
        .getClientsForNetwork(this.net.id, this.timespan, this.deviceType)
        .then(res => {
          this.loading = false;
          this.clients = res;
        });
    },
    /*
    onClientsSelected(clients) {
      // do something
      this.clientsSelected = [] = clients;
      console.log('clients page onClientsSeleted clients:', clients);
      //console.log('clients page onClientsSeleted clientsSelected'+ this.clientsSelected);
    },
    */
    getPolicies() {
      this.policies = [];
      this.$meraki.getPolicies(this.net.id).then(res => {
        console.log("clientsPage getPolicies res", res);
        this.policies = res;
      });
    },
    onPolicySelected(policy){
      this.policy = policy;
    },
    onClientsSelected(clients) {
      console.log('clients page onClientsSeleted clients:', clients);
      this.clientsSelected = clients;
      // Update the policy change to the clients
      let macs = [];
      this.clientsSelected.forEach(c => {
        macs.push(c.mac);
      });
      macs.forEach(m => {
        console.log("clientsPage updating clients", m, this.policy);
        let policyData = {
          "devicePolicy": "group",
          "groupPolicyId": this.policy
        };
        this.loading=true;
        this.$meraki.updateClientPolicy(this.net.id, m, this.timespan, policyData).then(res => {
          console.log('Client update complete', res);
          this.snackbar = {
            text: "Clients Updated",
            color: "green",
            active: true
          }
        }).catch(e => {
          console.log('Bummer. Could not update a client');
          this.snackbar = {
            text: "Bummer, Couldn't update a client",
            color: "red",
            active: true
          }
        }).finally(() => {
          this.loading=false;
          // refresh list
          this.onGetClientsForNetwork();
        });
      });
    }
  }
};
</script>
