<template>

<v-container fluid>
  <v-layout row wrap>
    <v-flex  xs12 sm6>
       <v-flex xs6>
        <v-subheader>Timespan</v-subheader>
      </v-flex>
       <v-flex xs12 sm6>    
        <v-select
            :items="timespanOptions"
            v-model="timespan"
            label="Select Timespan"
            single-line
          ></v-select>
      </v-flex>
      <v-flex xs6>
        <v-subheader>Device Type</v-subheader>
      </v-flex>
      <v-flex xs12 sm6>    
        <v-select
            :items="deviceTypeOptions"
            v-model="deviceType"
            label="Select Device Type"
            single-line
          ></v-select>
      </v-flex>
      <v-flex>
         <!--v-btn @click.stop="fetchClientsForNetwork">Get Clients</v-btn-->
      </v-flex>
      <v-flex xs6>
        <v-subheader>Group Policy</v-subheader>
      </v-flex>
      <v-flex sm4>
        <v-select
          :items="policies"
          item-text="name"
          item-value="groupPolicyId"
          v-model="policy"
          label="Select Policy"
          single-line
        ></v-select>
      </v-flex>
      <v-flex xs4>
        <v-btn color="warning" dark slot="activator" class="mb-2" @click="onUpdateClients()">Update Clients</v-btn>
      </v-flex>
      <v-flex sm6 hidden-xs-only> 
         <div class="text-xs-center">
            <v-chip v-for="c in selectedClients" :key="c.mac" color="primary"  text-color="white">{{c.description}}</v-chip>
          </div>
      </v-flex>

    </v-flex>

   
    <v-flex xs12 sm6 >
      
      <v-card>
        <v-list two-line subheader>
          <v-list-group
            
            v-for="client in clients"
            :key="client.$index"
            no-action
          >
            <v-list-tile slot="activator">
              <v-list-tile-action>
                <v-checkbox v-model="selectedClients" :value="client"></v-checkbox>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{ client.description ? client.description : client.mac}} </v-list-tile-title>
                <v-list-tile-sub-title><v-chip v-if="client.policy" small>{{ client.policy.name ? client.policy.name : client.policy.type }}</v-chip></v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile >
              <v-list-tile-content>
                <v-list-tile-title>Network Details</v-list-tile-title>
                <v-list-tile-sub-title>{{ client.ip }} : {{client.mac}}</v-list-tile-sub-title>
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
            
          </v-list-group>
        </v-list>
      </v-card>
      
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
var PulseLoader = require("vue-spinner/src/PulseLoader.vue");

export default {
  data: function() {
    return {
      selectedClients: [],
      clients: [],
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
      this.clients = [];
      this.selectedClients = [];
      // Get Clients
      this.$meraki
        .getClientsForNetwork(this.net.id, this.timespan, this.deviceType)
        .then(res => {
          this.clients = res;
          return (this.clients = this.removeDuplicates(this.clients, "id"));
        })
        // Get Policy for Each Client
        .then(() => {
          if (!this.clients) {
            return;
          }
          this.$meraki
            .getClientPolicyForClients(this.clients, this.net.id, this.timespan)
            .then(res => {
              this.clients = res;
              this.clients = this.addPolicyNames(this.clients, this.policies);
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
      clients.forEach(c => {
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
    }
  },
  watch: {
    net() {
      this.fetchPolicies();
      this.fetchClientsForNetwork();
    },
    timespan() {
      this.fetchClientsForNetwork();
    },
    deviceType() {
      this.fetchClientsForNetwork();
    }
  },
  mounted() {
    this.fetchPolicies();
    this.fetchClientsForNetwork();
  }
};
</script>
