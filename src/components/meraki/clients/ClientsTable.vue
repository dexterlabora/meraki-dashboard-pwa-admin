<template>
<v-container>
    <v-flex xs12 md12>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="items"
        select-all
        :pagination.sync="pagination"
        item-key="mac"
        class="elevation-1"
        :loading="loading"
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
              :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '', header.class]"
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
            <td>{{ props.item.dhcpHostname }}</td>
            <td class="text-xs-right">{{ props.item.mac }}</td>      
            <td class="text-xs-right hidden-xs-only">{{ props.item.ip }}</td>
            <td class="text-xs-right">{{ props.item.policy ? props.item.policy.type: 'None'}}</td>
            <td class="text-xs-right">{{ props.item.policy ? props.item.policy.name : ''}}</td>  
            <td class="text-xs-right hidden-xs-only">{{ props.item.policy ? props.item.policy.groupPolicyId : ''}}</td>   
            <td class="text-xs-right hidden-xs-only">{{ props.item.vlan }}</td>
            <td class="text-xs-right hidden-xs-only">{{ bytesToSize(props.item.usage.sent) }}</td> <!-- this is breaking the sort -->
            <td class="text-xs-right hidden-xs-only">{{ bytesToSize(props.item.usage.recv) }}</td> <!-- this is breaking the sort -->
            <td class="text-xs-right">{{ props.item.description }}</td>
      
            <td class="text-xs-right hidden-xs-only">{{ props.item.device.name}}</td>
            <td class="text-xs-right hidden-xs-only">{{ props.item.device.serial}}</td>
            <td class="text-xs-right hidden-xs-only">{{ props.item.device.model}}</td>
          </tr>
          
        </template>
      </v-data-table>
    </v-flex>
    <v-flex sm4>
      <v-select
        :items="policies"
        item-text="name"
        item-value="groupPolicyId"
        v-model="policy"
        label="Policy"
        single-line
      ></v-select>
    </v-flex>
    <v-flex xs4>
      <v-btn color="warning" dark slot="activator" class="mb-2" @click="onUpdateClients()">Update Clients</v-btn>
    </v-flex>
    
  </v-layout>
</v-container>
</template>

<script>
  export default {
    props: ['items', 'loading', 'policies'],
    data: () => ({
      policy: {},
      pagination: {
        sortBy: 'dhcpHostname'
      },
      selected: [],
      headers: [
        {
          text: 'Host Name',
          align: 'left',
          value: 'dhcpHostname'
        },
        { text: 'Client MAC', value: 'mac' },
        { text: 'Client IP', value: 'ip', class:'hidden-xs-only' },
        { text: 'Policy Type', value: 'groupPolicyType' },
        { text: 'Policy Name', value: 'groupPolicyName' },
        { text: 'Policy ID', value: 'groupPolicyId', class:'hidden-xs-only' },
        { text: 'VLAN', value: 'vlan', class:'hidden-xs-only' },
        { text: 'Usage Sent', value: 'usageSent', class:'hidden-xs-only' },
        { text: 'Usage Recv', value: 'usageRecv', class:'hidden-xs-only' },
        { text: 'Description', value: 'description' },
        { text: 'Device Name', value: 'deviceName', class:'hidden-xs-only' },
        { text: 'Device Serial', value: 'deviceSerial', class:'hidden-xs-only' },
        { text: 'Device Model', value: 'deviceModel', class:'hidden-xs-only' }
      ],
      
    }),

    methods: {
      toggleAll () {
        if (this.selected.length) this.selected = []
        else this.selected = this.items.slice()
      },
     bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      onUpdateClients(){
        this.$emit('clientsSelected', this.selected);
        console.log('emit selected' + JSON.stringify(this.selected));
      }
    },
    watch: {
      selected (){
        /*
        this.$emit('clientsSelected', this.selected);
        console.log('emit selected' + JSON.stringify(this.selected));
        */
      },
      policy (){
        this.$emit('policySelected', this.policy);
      }
    }
  }
</script>