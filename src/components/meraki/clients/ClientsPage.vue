<template>

<v-container>
  <v-layout row wrap>
    <v-flex  xs12 md12>
      <h2>Clients</h2>
      <p>
        Search the network for clients who have connected to a device type. You can then easily update the Group Policy of selected devices.
        Click on the info icon to get additional details about the client.
      </p>
      <p><i>Note: This script must query every device in the network to gather the clients. It then queries each client to gather policy details. It may take a minute to run. </i></p>
    </v-flex>
    <v-flex xs12 md6>
       <v-flex xs12 md5>
        <v-subheader>Timespan</v-subheader>   
        <v-select
            :items="timespanOptions"
            v-model="timespan"
            label="Select Timespan"
            single-line
          ></v-select>
      </v-flex>
      <v-flex xs12 md5>
        <v-subheader>Device Type</v-subheader> 
        <v-select
            :items="deviceTypeOptions"
            v-model="deviceType"
            label="Select Device Type"
            single-line
          ></v-select>
      </v-flex>
      <v-flex>
         <v-btn color="primary" @click.stop="fetchClientsForNetwork">Search for Clients</v-btn>
      </v-flex>
      
      <v-flex xs12 md12 pt-4>
        <h3>Update Policy Settings</h3>
        <v-flex xs612 md5>
          <i>Select clients to apply policy</i>
          <v-select
            :items="policies"
            item-text="name"
            item-value="groupPolicyId"
            v-model="policy"
            label="Select Group Policy"
            single-line
          ></v-select>
        </v-flex>
      <v-flex xs6 md4>
        <v-btn color="warning" dark slot="activator" class="mb-2" @click="onUpdateClients()">Update Clients</v-btn>
      </v-flex>
      <v-flex sm6 md12 hidden-xs-only> 
         <div class="text-xs-center">
            <v-chip v-for="c in selectedClients" :key="c.mac" color="gray"  text-color="black">{{c.description}}</v-chip>
          </div>
      </v-flex>
    </v-flex>
    </v-flex>

   
    <v-flex xs12 sm6>
      
      <v-card>
        <v-list two-line>
          <template v-for="(client, index) in clients">
            <v-list-tile
              :key="index"
            >
              <v-list-tile-action>
                <v-checkbox v-model="selectedClients" :value="client"></v-checkbox>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ client.description ? client.description : client.mac}} </v-list-tile-title>
                <v-list-tile-sub-title><v-chip v-if="client.policy" small color="green">{{ client.policy.name ? client.policy.name : client.policy.type }}</v-chip></v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn icon ripple :router="true" :to="{ name: 'clientDetails', params: {client: client}}">
                  <v-icon>info</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
            <!-- Removed dropdown details now that a details page was created
            <v-list-tile >
              <v-list-tile-content>
                <v-list-tile-title>Network Details</v-list-tile-title>
                <v-list-tile-sub-title>{{ client.ip }} : {{client.mac}}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile >
              <v-list-tile-content>
                <v-list-tile-title>Network Usage</v-list-tile-title>
                <v-list-tile-sub-title>Sent: {{bytesToSize(client.usage.sent*1024)}} | Received: {{ bytesToSize(client.usage.recv*1024) }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile >
              <v-list-tile-content>
                <v-list-tile-title>Connected to Device</v-list-tile-title>
                <v-list-tile-sub-title>{{ client.device.model }} : {{ client.device.mac }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <template v-if="client.policy">
              <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>Policy Type</v-list-tile-title>
                <v-list-tile-sub-title>{{ client.policy.type }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile v-if="client.policy.type == 'Group policy'">
              <v-list-tile-content>
                <v-list-tile-title>Policy ID</v-list-tile-title>
                <v-list-tile-sub-title>{{ client.policy.groupPolicyId }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
             <v-list-tile v-if="client.policy.type == 'Group policy'">
              <v-list-tile-content>
                <v-list-tile-title>Policy Name</v-list-tile-title>
                <v-list-tile-sub-title>{{ client.policy.name }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
           
            </template>
            --> 

          </template>
          </v-list>
      
        
      </v-card>
      
    </v-flex>

  </v-layout>
</v-container>
</template>

<script>
//var PulseLoader = require("vue-spinner/src/PulseLoader.vue");

export default {
  data: function() {
    return {
      selectedClients: [],
      //clients: [],
      clientsAndPolicy: [],
      policy: "",
      policies: [],
      deviceType: "MR",
      deviceTypeOptions: [
        { text: "Wireless", value: "MR" },
        { text: "Security", value: "MX" },
        { text: "Switch", value: "MS" }
      ],
      timespan: 3600,
      timespanOptions: [
        { text: "1 Hour", value: 3600 },
        { text: "12 Hours", value: 43200 },
        { text: "1 Day", value: 86400 },
        { text: "1 Week", value: 604800 },
        { text: "1 Month", value: 2592000 }
      ]
    };
  },
  methods: {
    fetchClientsForNetwork() {
      if (!this.net.id) {
        return;
      }
      //this.clients = [];
      this.selectedClients = [];
      // Get Clients
      this.$meraki
        .getClientsForNetwork(this.net.id, this.timespan, this.deviceType)
        .then(
          res => {
            //this.clients = res; //res[0]
            console.log("getClientsForNetwork res", res);
            //this.clients = this.removeDuplicates(res, "mac");
            //this.clients = res;
            this.$store.commit("setClients", res);
            //return this.clients;
            //return (this.clients = this.removeDuplicates(this.clients, "mac"));
          },
          error => {
            console.log("error getting clients for network", error);
          }
        )
        // Get Policy for Each Client
        .then(() => {
          if (!this.clients) {
            return;
          }
          this.$meraki
            .getClientPolicyForClients(this.net.id, this.clients, this.timespan)
            .then(res => {
              //this.clients = res;
              //this.clientsAndPolicy = res;
              this.clientsAndPolicy = this.addPolicyNames(
                this.clients,
                this.policies
              );
              this.$store.commit("setClients", this.clientsAndPolicy);
            });
        });
    },
    fetchPolicies() {
      this.policies = [];
      if (!this.net.id) {
        return;
      }
      this.$meraki.getPolicies(this.net.id).then(res => {
        this.policies = res;
        console.log("fetchPolicies ", this.policies);
      });
    },
    addPolicyNames(clients, policies) {
      console.log("addPolicyNames");
      let newClients = [];
      clients.map(c => {
        if (!c.policy) {
          return;
        }
        policies.forEach(p => {
          if (c.policy.groupPolicyId) {
            if (p.groupPolicyId == c.policy.groupPolicyId) {
              c.policy.name = p.name;
            }
          }
        });
        newClients.push(c);
      });
      return newClients;
    },
    onUpdateClients() {
      this.selectedClients.forEach(c => {
        console.log("clientsPage updating clients", c, this.policy);
        let policyData = {
          devicePolicy: "group",
          groupPolicyId: this.policy
        };
        this.$meraki
          .updateClientPolicy(this.net.id, c.mac, this.timespan, policyData)
          .then(res => {
            console.log("Client update complete", res);
            this.fetchClientsForNetwork();
          });
      });
    },
    bytesToSize(bytes) {
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (bytes == 0) return "0 Byte";
      var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
      return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
    },

    removeDuplicates(myArr, prop) {
      return myArr.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
      });
    }
  },
  computed: {
    org() {
      return this.$store.state.org;
    },
    net() {
      return this.$store.state.net;
    },
    nets() {
      return this.$store.state.nets;
    },
    clients() {
      return this.$store.state.clients;
    }
  },
  watch: {
    net() {
      this.fetchPolicies();
      this.fetchClientsForNetwork();
    }
  },
  mounted() {
    this.fetchPolicies();
    this.fetchClientsForNetwork();
  }
};
</script>
