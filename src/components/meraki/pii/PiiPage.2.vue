<template>
    <v-container fluid>
    <v-layout row wrap>
        <v-flex xs12 md12>  
            <h2>Personal Identifying Information</h2>
            <p>A tool to examine, export or adjust the information processed by Cisco Meraki.</p>
        </v-flex>
        <v-flex xs12 md12>   
            <v-form ref="form" v-model="formValid" lazy-validation>
            <v-flex xs12 md6>    
                <v-select
                    required
                    :items="piiTypeOptions"
                    v-model="form.piiType"
                    label="Select Identifier"
                    single-line
                    :rules="[v => !!v || 'Item is required']"
                ></v-select>
            </v-flex> 
            <v-flex xs12 md6>
                <v-text-field
                    required
                    v-model="form.pii"
                    label="Personal Identifying Information"
                    placeholder="MAC, e-mail, IMEI"
                    :rules="[v => !!v || 'Item is required']"
                ></v-text-field>
                <span><v-btn color="primary" dark slot="activator" class="mb-2" @click="onSearch()">Search</v-btn></span>
            </v-flex>
            </v-form>
        </v-flex>
        <v-flex xs12 md6 mt-5>
        <v-card v-if="piiResultsArray.length > 0">
            <v-card-title>
                <h3 class="headline mb-0">Search Results</h3>
            </v-card-title>
            <v-card-text>
            <v-list v-for="p in piiResultsArray" :key="p.networkId">
                <v-list-group
                    v-model="piiResultsArray.active"
                    :key="p.networkId"
                    no-action
                >
                    <v-list-tile slot="activator">
                    <v-list-tile-content>
                        <v-list-tile-title>Network: {{p.networkName}}</v-list-tile-title>
                        <v-list-tile-sub-title>ID: {{p.networkId}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    </v-list-tile>

                    <template v-for="(k,i) of Object.keys(p)">
                        <template v-if="typeof p[k] === 'object'">
                            <v-subheader v-if="p[k].length > 0" :key="i">{{k}}</v-subheader>
                            <v-list-tile v-for="(item, index) in p[k]" v-bind:key="index" mt-0>
                                <v-list-tile-content>
                                    <v-list-tile-title>{{item}}</v-list-tile-title>
                                    <template  v-if="findPiiRequest(k.replace(/s+$/, ''),item)"> 
                                        <v-list-tile-sub-title><i>Requested Change: {{new Date(findPiiRequest(k.replace(/s+$/, ''),item).createdAt*1000).toLocaleString().split(',')[0]}}</i></v-list-tile-sub-title>
                                        <!--v-list-tile-sub-title v-if="findPiiRequest(k).completedAt"><i>Completed: {{new Date(findPiiRequest(item).completedAt*1000).toLocaleString().split(',')[0]}}</i></v-list-tile-sub-title-->
                                    </template>
                                </v-list-tile-content>    
                                        <v-list-tile-action v-if="['username', 'email', 'mac', 'smUserId', 'smDeviceId', 'bluetoothMac'].indexOf(k.replace(/s+$/, '')) >= 0">
                                            <v-btn icon ripple @click="onModify(k.replace(/s+$/, ''),item)"> 
                                                <v-icon color="red darken-4">block</v-icon>
                                            </v-btn>
                                        </v-list-tile-action>
                            </v-list-tile>
                        </template>
                    </template>
<!--
                    <v-subheader v-if="p.usernames.length > 0">Usernames</v-subheader>
                    <v-list-tile v-for="username in p.usernames" v-bind:key="username" mt-0>
                        <v-list-tile-content>
                            <v-list-tile-title>{{username}}</v-list-tile-title>
                            <template  v-if="findPiiRequest({username})"> 
                                <v-list-tile-sub-title><i>Requested Change: {{new Date(findPiiRequest(username).createdAt*1000).toLocaleString().split(',')[0]}}</i></v-list-tile-sub-title>
                                <v-list-tile-sub-title v-if="findPiiRequest(username).completedAt"><i>Completed: {{new Date(findPiiRequest(username).completedAt*1000).toLocaleString().split(',')[0]}}</i></v-list-tile-sub-title>
                            </template>
                        </v-list-tile-content>    
                                <v-list-tile-action>
                                    <v-btn icon ripple @click="onModify('username', username)">
                                        <v-icon color="red darken-4">block</v-icon>
                                    </v-btn>
                                </v-list-tile-action>
                    </v-list-tile>
                    <v-subheader v-if="p.emails.length > 0">Emails</v-subheader>
                    <v-list-tile v-for="email in p.emails" v-bind:key="email">
                        <v-list-tile-content>
                            <v-list-tile-title>{{email}}</v-list-tile-title> 
                        </v-list-tile-content>   
                        <v-list-tile-action>
                                <v-btn icon ripple @click="onModify('email', email)">
                                <v-icon color="red darken-4">block</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-subheader v-if="p.serials.length > 0">Serials</v-subheader>
                    <v-list-tile v-for="serial in p.serials" v-bind:key="serial">
                        <v-list-tile-content>
                            <v-list-tile-title>{{serial}}</v-list-tile-title>  
                        </v-list-tile-content>  
                        <v-list-tile-action>
                            <v-btn icon ripple @click="onModify('serial', serial)">
                                <v-icon color="red darken-4">block</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                    <v-subheader v-if="p.imeis.length > 0">IMEIs</v-subheader>
                    <v-list-tile v-for="imei in p.imeis" v-bind:key="imei">
                        <v-list-tile-content>
                        <v-list-tile-title>{{imei}}</v-list-tile-title>                      
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn icon ripple @click="onModify('imei', imei)">
                                <v-icon color="red darken-4">block</v-icon>
                            </v-btn>
                        </v-list-tile-action>    
                    </v-list-tile>
                    <v-subheader v-if="p.macs.length > 0">MAC Addresses</v-subheader>
                    <v-list-tile v-for="mac in p.macs" v-bind:key="mac">
                        <v-list-tile-content>
                        <v-list-tile-title>{{mac}}</v-list-tile-title>
                        </v-list-tile-content>   
                        <v-list-tile-action>
                            <v-btn icon ripple @click="onModify('mac', mac)">
                                <v-icon color="red darken-4">block</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                    <template v-if="p.smDevices">
                    <v-subheader v-if="p.smDevices.length > 0">SM Devices</v-subheader>
                    <v-list-tile v-for="smDeviceId in p.smDevices" v-bind:key="smDeviceId">
                        <v-list-tile-content>
                            <v-list-tile-title>{{smDeviceId}} </v-list-tile-title> 
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn icon ripple @click="onModify('smDeviceId', smDeviceId)">
                                <v-icon color="red darken-4">block</v-icon>
                            </v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                    </template>
                    -->
            </v-list-group>
            </v-list>







            </v-card-text>
            <v-flex xs12 md12>
            <v-btn color="success" class="mb-2" @click="exportCsv()">Export</v-btn>
            <!--v-btn color="warning" outline class="mb-2" @click="dialog = true">Adjust</v-btn-->
        </v-flex>
        </v-card>
        </v-flex>

        <v-flex>
            <v-dialog v-model="dialog" max-width="500px" persistent>
        <v-card>
          <v-card-title>
            Manage PII Processing
          </v-card-title>
          <v-card-text>
            <v-flex>
                <v-card-title>  
                    <strong>
                        Warning: These changes will have a significant impact as to how Cisco Meraki will process the selected Personal Indetifying Information. 
                        Please read more about this <a href="#">here</a>.
                    </strong>
                </v-card-title>
            
            <hr>

            </v-flex>
            <v-flex>
                Modify processing for: 
                <div v-for="(value, key) in formModify" :key=value>
                    <b>{{key}}</b> : <span class="red--text">{{value}}</span>
                </div>
            </v-flex>
            <v-flex mt-2>
            <v-checkbox
                v-model="confirm"
                label="I understand."
                required
                >
            </v-checkbox>
                <v-btn color="error" outline @click.stop="onDelete()" :disabled="!confirm">Delete All Information</v-btn>
                <v-btn v-if="formModify.mac || formModify.smDeviceId || formModify.smUserId" color="error" outline @click.stop="onRestrict()" :disabled="!confirm">Restrict Processing</v-btn>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" flat @click.stop="dialog=false; confirm=false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
        </v-flex>
        
        <v-flex>
        <!--v-bottom-sheet v-model="sheet">
            <h2>Warning:</h2>
                <p>You are about to modify how user data is store or processed by Cisco Meraki.</p>
                <p><a href="#">More Info</a></p>
            <v-btn color="error" class="mb-2 text-xs-center" @click="fetchPii()">Stop Processing User Data</v-btn>
            <v-btn color="error" class="mb-2" @click="fetchPii()">Delete All User Data</v-btn>
        </v-bottom-sheet-->
            
        </v-flex>

    </v-layout>
    </v-container>
</template>

<script>
import DownloadJS from "downloadjs";
import JSONbig from "json-bigint";

export default {
  data() {
    return {
      confirm: false,
      formValid: false,
      formModify: {},
      form: {
        pii: "",
        piiType: ""
      },
      piiTypeOptions: ["mac", "email", "serial", "imei"],
      dialog: false,
      smDevices: {},

      //SAMPLE FOR TESTING
      /*
      smDevices: {
        N_660903245316634908: ["660903245316908972"]
      },
      */
      piiRequests: [],
      piiResults: {} // returns an Object (NetworkID) of Objects (PII results)
      //SAMPLE FOR TESTING
      /*
      piiResults: {
        N_660903245316634908: {
          usernames: ["meraki\\miles"],
          emails: ["testmiles@meraki.com"],
          macs: ["34:36:3b:cc:a6:76", "ff:ff:ff:aa:bb:cc"],
          serials: ["C02P71WNG3QR"],
          imeis: [],
          "sm_device_ids": [
                "660903245316909407"
            ]
        },
        N_660903245316635446: {
          usernames: ["meraki\\miles"],
          emails: ["testmiles@meraki.com"],
          macs: ["74:e1:b6:8e:55:6f"],
          serials: ["DLXH7KQ3DVGG"],
          imeis: ["01 311700 869146 8"]
        }
      }
      */
    };
  },
  computed: {
    org() {
      return this.$store.state.org;
    },
    nets() {
      return this.$store.state.nets;
    },
    net() {
      return this.$store.state.net;
    },
    piiNets() {
      let netIds = Object.keys(this.piiResults);
      let nets = [];
      for (let n of netIds) {
        nets.push(this.nets.find(net => net.id === n));
      }
      return nets;
    },
    piiResultsArray() {
      let array = [];
      if (!this.piiNets) {
        return;
      }
      try {
        // Merge data into single array for easier processing
        this.piiNets.forEach(net => {
          let network = { networkId: net.id, networkName: net.name };
          let smDevices = { smDeviceIds: this.smDevices[net.id] };
          let merged = { ...network, ...this.piiResults[net.id], ...smDevices };
          array.push(merged);
        });
        return array;
      } catch (e) {
        console.log("error getting pii results");
        return [];
      }
    }
  },
  methods: {
    onSearch() {
      if (this.$refs.form.validate()) {
        this.fetchPii();
      }
    },
    findPiiRequest(param, value) {
      console.log("findPiiRequest param, value", param, value);
      return this.piiRequests.find(i => {
        return i[param] === value;
      });
    },
    /*
    findPiiRequest(param){
        console.log('findPiiRequest param', param);
        let paramNames = typeof param === 'object' ? Object.keys(param) : '';
        console.log('paramNames', paramNames);
        let paramName = paramNames[0]; // get the first and only param
        console.log('paramName',paramName);
        return this.piiRequests.find(i => {
            return i[paramName] === param[paramName];
        });
    },
    */
    fetchPii() {
      console.log("fetchPii", this.form);
      this.$meraki
        .getPiiKeys(this.org.id, this.form.piiType, this.form.pii)
        .then(res => {
          console.log("fetchPii res", res);
          this.piiResults = res;
          this.fetchSmDevices();
        });
    },
    fetchSmDevices() {
      console.log("fetchSmDevices fetching");
      this.$meraki
        .getSmDevicesForKey(this.org.id, this.form.piiType, this.form.pii)
        .then(
          res => {
            console.log("fetchSmDevices res", res);
            this.smDevices = res;
          },
          err => {
            console.log("error fetching SM devices", err);
          }
        );
    },
    fetchPiiRequests() {
      this.$meraki.getPiiRequests(this.org.id).then(res => {
        this.piiRequests = res;
      });
    },
    onModify(param, value) {
      this.formModify = {};
      console.log("onModify param", param);
      this.dialog = true;
      this.formModify[param] = value;
      /*
        console.log('findPiiRequest param', param);
        let paramNames = typeof param === 'object' ? Object.keys(param) : '';
        console.log('paramNames', paramNames);
        let paramName = paramNames[0]; // get the first and only param
        console.log('paramName',paramName);
        this.formModify[paramName] = param[paramName];
        */
    },
    onRestrict() {
      const options = {
        type: "restrict processing",
        ...this.formModify
      };
      console.log("onRestrict options", options);
      this.$meraki.submitPiiRequest(this.org.id, options).then(res => {
        console.log("restrictPii res", res);
        this.dialog = false;
        this.fetchPii(); //refresh results
        // NOTIFY USER
      });
    },
    onDelete() {
      const options = {
        type: "delete",
        datasets: "all", // Hard coded for now. TODO build selector "all",[ "usage", "events", loginAttempts]
        ...this.formModify
      };
      console.log("onDelete options", options);
      this.$meraki.submitPiiRequest(this.org.id, options).then(res => {
        console.log("restrictPii res", res);
        this.dialog = false;
        this.fetchPii(); //refresh results
        // NOTIFY USER
      });
    },
    CSV(objArray) {
      const array =
        typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
      let str =
        `${Object.keys(array[0])
          .map(value => `"${value}"`)
          .join(",")}` + "\r\n";

      return array.reduce((str, next) => {
        str +=
          `${Object.values(next)
            .map(value => `"${value}"`)
            .join(",")}` + "\r\n";
        return str;
      }, str);
    },
    exportCsv() {
      console.log(
        "exportCsv this.piiResultsArray" + JSON.stringify(this.piiResultsArray)
      );
      const csvData = this.CSV(this.piiResultsArray);
      console.log("csvData string", csvData);
      const exportFilename = `Meraki-PII-Export-${new Date()}.csv`;
      DownloadJS(csvData, exportFilename, "text/csv");
    },
    handleBigInt(data) {
      try {
        return JSON.parse(JSONBigInt.parse(data));
      } catch (err) {
        return data;
      }
    }
  },
  created() {
    this.fetchPiiRequests();
  }
};
</script>

<style>
.subheader {
  height: 10px;
}
</style>
 