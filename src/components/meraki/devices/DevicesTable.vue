<template>
  <v-data-table
      v-bind:headers="headers"
      :items="devices"
      hide-actions
      class="elevation-1"
    >
    <template slot="headers" slot-scope="props">
      <tr>
        <th>
          <v-checkbox
            primary
            hide-details
            @click.native="toggleAll"
            :input-value="props.all"
            :indeterminate="props.indeterminate"
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
      <tr :active="props.selected" @click="props.selected = !props.selected">
        <td>
          <v-checkbox
            primary
            hide-details
            :input-value="props.selected"
          ></v-checkbox>
        </td>
      <td>{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.model }}</td> 
      <td class="text-xs-right">{{ props.item.lanIp }}</td>
      <td class="text-xs-right">{{ props.item.wan1ip }}</td>
      <td class="text-xs-right">{{ props.item.wan2ip }}</td> 
      <td class="text-xs-right">{{ props.item.serial }}</td>     
      <td class="text-xs-right">{{ props.item.mac }}</td>
      <td class="text-xs-right">{{ props.item.lat }}</td>
      <td class="text-xs-right">{{ props.item.lng }}</td>
      <td class="text-xs-right">{{ props.item.address }}</td>
      <td class="text-xs-right">{{ props.item.tags }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    data: function() {
		return {
            devices: [],
            pagination: 'asc',

            headers: [
            {
                text: 'Name',
                align: 'left',
                value: 'name'
            },
            { text: 'Model', value: 'model' },
            { text: 'LAN IP', value: 'lanIp' },
            { text: 'WAN 1 IP', value: 'wan1Ip' },
            { text: 'WAN 2 IP', value: 'wan2Ip' },
            { text: 'Serial', value: 'serial' },
            { text: 'MAC', value: 'mac' },
            { text: 'LAT', value: 'lat' },
            { text: 'LNG', value: 'lng' },
            { text: 'Address', value: 'address' },
            { text: 'Tags', value: 'tags' }
            ]
        }
    },
    computed:{
      net () {
        console.log("state net: ",this.$store.state.net);
        return this.$store.state.net
      }
    },
    watch: {
      net: function () {
        this.fetchDevices();
      }
    },
    methods: {
      fetchDevices: function () {
        if(!this.net){
          return;
        }

        this.$meraki.getDevices(this.net.id)
          .then(
            res => {
              this.devices = res;
            },
            err => {
              console.log('error getting devices', err);
            }
          );
      }

    },
    mounted: function () {
      this.fetchDevices();
    },
    
  }

</script>