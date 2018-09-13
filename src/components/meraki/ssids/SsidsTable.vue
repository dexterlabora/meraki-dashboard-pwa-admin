<template>
  <v-card>
    <v-card-title>
   
            <v-checkbox
            v-model="searchOrg"
            primary
            label="Search Org"
            hide-details
          ></v-checkbox>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      >

      </v-text-field>
    </v-card-title>
     
    <v-dialog v-model="dialog" max-width="500px">
      <v-btn slot="activator" color="primary" dark class="mb-2">Edit Ssid</v-btn>
      <ssid-settings :initForm="formItem" @save="formSaved" @cancel="formCancel"></ssid-settings> 
        
    </v-dialog>
  <v-data-table
      v-model="selected"
      v-bind:headers="headers"
      :pagination.sync="pagination"
      :items="ssids"
      :search="search"
      class="elevation-1"
      :loading="loading"
      select-all
    >
    <template slot="headers" slot-scope="props">
      <tr>
        <th>
          <v-checkbox
            :input-value="props.all"
            :indeterminate="props.indeterminate"
            primary
            hide-details
            @click.native="toggleAll"
          ></v-checkbox>
        </th>
        <th
          v-for="header in props.headers"
          :key="header.text"
          :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
          @click="changeSort(header.value)"
        >
          <v-icon small>arrow_upward</v-icon>
          {{ header.text }}
        </th>
      </tr>
    </template>
    <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
    <template slot="items" slot-scope="props">
      <tr :active="props.selected" >
        <td>
          <v-checkbox     
            primary
            hide-details
            :input-value="props.selected"
            @click="props.selected = !props.selected"
          ></v-checkbox>
        </td>
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.number }}</td>
        <td>{{ props.item.enabled }}</td>
        <td>{{ props.item.splashPage }}</td>
        <td>{{ props.item.ipAssignmentMode }}</td>
        <td>{{ props.item.useVlanTagging }}</td>
        <td>{{ props.item.authMode }}</td>
        <td>{{ props.item.walledGardenEnabled }}</td>
        <td>{{ props.item.walledGardenRanges }}</td>
        <td>{{ props.item.minBitrate }}</td>
        <td>{{ props.item.bandSelection }}</td>
        <td>{{ props.item.perClientBandwidthLimitUp }}</td>
        <td>{{ props.item.perClientBandwidthLimitDown }}</td>
        <td>{{ props.item.networkName }}</td>
        <td>{{ props.item.networkId }}</td>



        <!--td v-for="i in props.item" 
          class="text-xs-right" :key="number">
          
          {{i}}
        </td-->
        
      </tr>
      
    </template>
     <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
  </v-data-table>
  <div v-if="selectedCount > 0" >
     <p class="text-sm-center">Modifying <b>{{selectedCount}}</b> SSIDs</p>
  </div>
   
  </v-card>
</template>

<script>
import SsidSettings from "./SsidSettings";
export default {
  name: "SsidsTable",
  components: {
    SsidSettings
  },
  data: function() {
    return {
      search: "",
      dialog: false,
      searchOrg: false,
      editedIndex: -1,
      formItem: {},
      ssids: [],
      pagination: {
        sortBy: "name"
      },
      selected: [],
      headers: [
        {
          text: "Name",
          align: "left",
          value: "name"
        },
        { text: "Number", value: "number" },
        { text: "Enabled", value: "enabled" },
        { text: "Splash Page", value: "splashPage" },
        { text: "IP Assignment", value: "ipAssignmentMode" },
        { text: "VLAN Tagging", value: "useVlanTagging" },
        { text: "Auth Mode", value: "authMode" },
        { text: "Walled Garden", value: "walledGardenEnabled" },
        { text: "Walled Garden Ranges", value: "walledGardenRanges" },
        { text: "Min. Bit Rate", value: "minBitrate" },
        { text: "Band Selection", value: "bandSelection" },
        {
          text: "Client Bandwidth Limit Up",
          value: "perClientBandwidthLimitUp"
        },
        {
          text: "Client Bandwidth Limit Down",
          value: "perClientBandwidthLimitDown"
        },
        { text: "Network", value: "networkName" },
        { text: "Network ID", value: "networkId" }
      ]
    };
  },
  computed: {
    net() {
      return this.$store.state.net;
    },
    nets() {
      return this.$store.state.nets;
    },
    formTitle() {
      return this.selected.length < 2 ? "Edit Ssid" : "Edit Multiple Ssids";
    },
    loading() {
      return this.$store.state.loading;
    },
    selectedCount() {
      return this.selected.length;
    }
  },
  watch: {
    net: function() {
      this.fetchSsids();
    },
    searchOrg(val) {
      if (val) {
        this.fetchSsidsForOrg();
      } else {
        this.fetchSsids();
      }
    },
    dialog(val) {
      val || this.close();
    },
    selected() {
      if (this.selected.length === 1) {
        this.formItem = { ...this.formItem, ...this.selected[0] };
        console.log("only one selected", this.formItem);
      } else {
        console.log("no items selected or multiple items selected");
        this.formItem = {};
      }
    }
  },
  methods: {
    formCancel() {
      this.close();
    },
    formSaved: async function(event) {
      this.close();
      console.log("formSaved event", event);
      for (let s of this.selected) {
        try {
          await this.$meraki
            .updateSsid(s.networkId, s.number, event)
            .then(res => {
              // update table selection
              this.ssids.forEach((element, index) => {
                if (s.id === element.id) {
                  res.id = s.id;
                  res.networkId = s.networkId;
                  res.networkName = s.networkName;
                  this.ssids[index] = res;
                  this.ssids = [...[], ...this.ssids]; //starts fresh array to reset table state
                }
              });
            });
        } catch (e) {
          console.log("error updating", s, e);
        }
      }
    },
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.ssids.slice();
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.formItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      let ssids = this.selected;

      let options = this.formItem;
      this.updateSsids(ssids, options);
      // reset edit form
      this.formItem = {};
      this.close();
    },
    updateSsids: async function(ssids, options) {
      for (let s of ssids) {
        console.log("Updating Ssid: ", s["networkId"], s["serial"], options);
        const update = await this.$meraki
          .updateSsid(s["networkId"], s["serial"], options)
          .then(res => {
            return res;
          });
        console.log("Ssid Updated: ", s["networkId"], s["serial"], update);
      }
      this.fetchSsids();
    },
    fetchSsids: function() {
      this.ssids = [];
      this.$meraki.getSsids(this.net.id).then(res => {
        res.forEach(s => {
          s.networkId = this.net.id;
          s.networkName = this.net.name;
          s.id = "id_" + this.net.id + "ssid_" + s.number;
        });

        this.ssids = res;
      });
    },
    fetchSsidsForOrg: async function() {
      console.log("this.nets", this.nets);
      this.ssids = [];
      for (let n of this.nets) {
        console.log("n", n);

        try {
          const netSsids = await this.$meraki.getSsids(n.id).then(res => {
            res.forEach(s => {
              s.networkId = n.id;
              s.networkName = n.name;
              s.id = "id_" + n.id + "ssid_" + s.number;
            });
            return res;
          });
          this.ssids = [...this.ssids, ...netSsids];
        } catch (e) {
          console.log("could not get SSIDs for network", n.id, n.name);
          continue;
        }
      }
    }
  },
  mounted: function() {
    /*
    EventBus.$on("before-request", function(payLoad) {
      console.log("");
      this.loading = true;
    });
    EventBus.$on("after-response", function(payLoad) {
      this.loading = false;
    });
    */
    this.fetchSsids();
  }
};
</script>