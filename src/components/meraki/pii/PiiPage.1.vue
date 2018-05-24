<template>
    <v-container fluid>
    <v-layout row wrap>
        <v-flex xs12 md12>  
            <h2>Personal Identifying Information</h2>
            <p>A tool to examine, export or adjust the information processed by Cisco Meraki.</p>
        </v-flex>
        <v-flex xs12 md12>   
            <v-flex xs12 md6>    
                <v-select
                    :items="piiTypeOptions"
                    v-model="form.piiType"
                    label="Select Identifier"
                    single-line
                ></v-select>
            </v-flex> 
            <v-flex xs12 md6>
                <v-text-field
                    v-model="form.pii"
                    label="Personal Identifying Information"
                    placeholder="MAC, e-mail, IMEI"
                ></v-text-field>
                <span><v-btn color="primary" dark slot="activator" class="mb-2" @click="lookupPii()">Search</v-btn></span>
            </v-flex>
        </v-flex>
        <v-flex xs12 md6 mt-5>
        <v-card v-if="piiNets[0]">
            <v-card-title>
                Results
            </v-card-title>
            <v-card-text>
            <v-list v-for="n in piiNets" :key="n.id">
                <v-list-group
                    v-model="piiResults.active"
                    :key="piiResults[n.id].mac"
                    no-action
                >
                    <v-list-tile slot="activator">
                    <v-list-tile-content>
                        <v-list-tile-title>Network: {{n.name}}</v-list-tile-title>
                        <v-list-tile-sub-title>ID: {{n.id}}</v-list-tile-sub-title>
                    </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile @click="">
                        <v-list-tile-title>Usernames</v-list-tile-title>
                            <v-list-tile-sub-title v-for="username in piiResults[n.id].usernames" v-bind:key="username">
                                {{username}}
                            </v-list-tile-sub-title>      
                        </v-list-tile>
                    <v-list-tile @click="">
                        <v-list-tile-title>Emails</v-list-tile-title>
                            <v-list-tile-sub-title v-for="email in piiResults[n.id].emails" v-bind:key="email">
                                {{email}}
                            </v-list-tile-sub-title>      
                        </v-list-tile>
                    <v-list-tile @click="">

                        <v-list-tile-title>Serials</v-list-tile-title>
                        <v-list-tile-sub-title v-for="serial in piiResults[n.id].serials" v-bind:key="serial">
                            {{serial}}
                        </v-list-tile-sub-title>      
                    </v-list-tile>
                    <v-list-tile @click="">
                        <v-list-tile-title>IMEIs</v-list-tile-title>
                        
                        <v-list-tile-sub-title v-for="imei in piiResults[n.id].imeis" v-bind:key="imei">
                            {{imei}}
                        </v-list-tile-sub-title>      
                    </v-list-tile>
                                    <v-list-tile @click="">
                        <v-list-tile-title>Macs</v-list-tile-title>
                        
                        <v-list-tile-sub-title v-for="mac in piiResults[n.id].macs" v-bind:key="mac">
                            {{mac}}
                        </v-list-tile-sub-title>      
                    </v-list-tile>
            </v-list-group>
            </v-list>







            </v-card-text>
            <v-flex xs12 md12>
            <v-btn color="success" class="mb-2" @click="exportCsv()">Export</v-btn>
            <v-btn color="warning" outline class="mb-2" @click="dialog = true">Adjust</v-btn>
            <!--json-excel
                class   = "btn btn-default"
                :data   = "csv_data"
                :fields = "csv_fields"
                type    = "csv"
                name    = "pii.csv">
            
                <v-icon left>cloud_download</v-icon> Export
            
            </json-excel-->
        </v-flex>
        </v-card>
        </v-flex>

        <v-flex>
            <v-dialog v-model="dialog" max-width="500px">
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
            <v-flex mt-2>
            <v-checkbox
                v-model="confirm"
                label="I understand."
                required
                >
            </v-checkbox>
                <v-btn color="error" outline @click.stop="dialog=false" :disabled="!confirm">Delete All Information</v-btn>
                <v-btn color="error" outline @click.stop="dialog=false; onRestrict()" :disabled="!confirm">Restrict Processing</v-btn>
            </v-flex>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" flat @click.stop="dialog=false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
        </v-flex>
        
        <v-flex>
        <!--v-bottom-sheet v-model="sheet">
            <h2>Warning:</h2>
                <p>You are about to modify how user data is store or processed by Cisco Meraki.</p>
                <p><a href="#">More Info</a></p>
            <v-btn color="error" class="mb-2 text-xs-center" @click="lookupPii()">Stop Processing User Data</v-btn>
            <v-btn color="error" class="mb-2" @click="lookupPii()">Delete All User Data</v-btn>
        </v-bottom-sheet-->
            
        </v-flex>

    </v-layout>
    </v-container>
</template>

<script>
import JsonExcel from "vue-json-excel";
import saveCsv from "save-csv";
import FileSaver from "file-saver";
import DownloadJS from "downloadjs";

export default {
  components: {
    "json-excel": JsonExcel
  },
  data() {
    return {
        confirm: false,
        form: {
            pii: "",
            piiType: ""
      },
      piiTypeOptions: ["mac", "email", "serial", "imei"],
      dialog: false,
      piiResults: {} // returns an Object (NetworkID) of Objects (PII results)
      //SAMPLE FOR TESTING
      /*
      piiResults: {
        N_660903245316634908: {
          usernames: ["meraki\\miles"],
          emails: ["testmiles@meraki.com"],
          macs: ["34:36:3b:cc:a6:76"],
          serials: ["C02P71WNG3QR"],
          imeis: []
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
  methods: {
    lookupPii() {
      console.log("lookupPii", this.form);
      this.$meraki
        .getPiiKeys(this.org.id, this.form.piiType, this.form.pii)
        .then(res => {
          console.log("lookupPii res", res);
          this.piiResults = res;
        });
    },
    onRestrict(mac){

        this.restrictPii(this.org.id, mac)
    },
    restrictPii(orgId, clientMac){
        let options = {
            type: "restrict processing",
            datasets: ["username"], // hard coded for testing
            mac: clientMac
        };
        options[this.form.piiType] = this.form.pii;
        this.$meraki.submitPiiRequest(orgId, options).then( res => {
            console.log('restrictPii res', res);
        })
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
      console.log('exportCsv this.piiResultsArray'+ JSON.stringify(this.piiResultsArray));
      const csvData = this.CSV(this.piiResultsArray);
      const exportFilename = `Meraki-PII-Export-${new Date()}.csv`;  
      DownloadJS(csvData, exportFilename, "text/csv");
    }
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
      this.piiNets.forEach(net => {
        let obj = { networkId: net.id, networkName: net.name };
        let merged = { ...obj, ...this.piiResults[net.id] };
        array.push(merged);
      });
      return array;
    }
  }
};
</script>

<style>
</style>
 