<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
        <v-btn slot="activator" color="primary" dark class="mb-2">Edit Device</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>  
                  <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="editedItem.tags" label="Tags"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="editedItem.lat" label="Latitude"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field v-model="editedItem.lng" label="Longitude"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="editedItem.address" label="Address"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-checkbox
                    primary
                    hide-details
                    label="Move Map Marker"
                    v-model="editedItem.moveMapMarker"
                  ></v-checkbox>
                  
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
            <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  <v-data-table
      v-model="selected"
      v-bind:headers="headers"
      :items="devices"
      class="elevation-1"
      item-key="serial"
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
    <template slot="items" slot-scope="props">
      <tr :active="props.selected" @click="props.expanded = !props.expanded">
        <td>
          <v-checkbox     
            primary
            hide-details
            :input-value="props.selected"
            @click="props.selected = !props.selected"
          ></v-checkbox>
        </td>
        
        <td>{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.model }}</td> 
        <td class="text-xs-right">{{ props.item.lanIp }}</td>
        <td class="text-xs-right">{{ props.item.wan1ip }}</td>
        <td class="text-xs-right">{{ props.item.wan2ip }}</td> 
        <td class="text-xs-right">{{ props.item.serial }}</td>     
        <td class="text-xs-right">{{ props.item.mac }}</td>
        <td class="text-xs-right">{{ props.item.address }}</td>
        <td class="text-xs-right">{{ props.item.tags }}</td>
      </tr>
    </template>
    <template slot="expand" slot-scope="props">
      <v-card flat>
        <v-card-text>
            <gmap-map :center="{
            lat: parseFloat(props.item.lat),
            lng: parseFloat(props.item.lng)
          }" :zoom="15" map-type-id="terrain" style="width: 500px; height: 400px">
                    <gmap-marker :key="props.item.serial" :position="{
            lat: parseFloat(props.item.lat),
            lng: parseFloat(props.item.lng)
          }" />
                </gmap-map>
                <i>{{ props.item.lat }}/{{ props.item.lng }}</i>
        </v-card-text>
      </v-card>
    </template>
  </v-data-table>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      dialog: false,
      editedIndex: -1,
      editedItem: {},
      devices: [],
      pagination: "asc",
      selected: [],
      headers: [
        {
          text: "Name",
          align: "left",
          value: "name"
        },
        { text: "Model", value: "model" },
        { text: "LAN IP", value: "lanIp" },
        { text: "WAN 1 IP", value: "wan1Ip" },
        { text: "WAN 2 IP", value: "wan2Ip" },
        { text: "Serial", value: "serial" },
        { text: "MAC", value: "mac" },
        { text: "Address", value: "address" },
        { text: "Tags", value: "tags" }
      ]
    };
  },
  computed: {
    net() {
      console.log("state net: ", this.$store.state.net);
      return this.$store.state.net;
    },
    formTitle() {
      return this.selected.length < 2 ? "Edit Device" : "Edit Multiple Devices";
    }
  },
  watch: {
    net: function() {
      this.fetchDevices();
    },
    dialog(val) {
      val || this.close();
    },
    selected() {
      if (this.selected.length === 1) {
        this.editedItem = _.pick(this.selected[0], [
          "name",
          "tags",
          "lat",
          "lng",
          "moveMapMarker"
        ]);
      }
    }
  },
  methods: {
    toggleAll() {
      if (this.selected.length) this.selected = [];
      else this.selected = this.devices.slice();
    },
    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      let devices = this.selected; // this.selected.map(s => s.serial);

      //console.log("serials", serials);
      let options = this.editedItem;
      this.updateDevices(devices, options);
      // reset edit form
      this.editedItem = {};
      this.close();
    },
    updateDevices: async function(devices, options) {
      for (let d of devices) {
        console.log("Updating Device: ", d["networkId"], d["serial"], options);
        const update = await this.$meraki
          .updateDevice(d["networkId"], d["serial"], options)
          .then(res => {
            return res;
          });
        console.log("Device Updated: ", d["networkId"], d["serial"], update);
      }
      this.fetchDevices();
    },
    fetchDevices: function() {
      this.$meraki.getDevices(this.net.id).then(res => (this.devices = res));
    }
  },
  mounted: function() {
    this.fetchDevices();
  }
};
</script>