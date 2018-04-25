<template>
<div>
  <h2>Inventory</h2>
  <v-card v-for="i in inventory" :key="i.serial">  
    <v-card-title primary-title>
        <b>{{i.model}}</b>
    </v-card-title>
    <v-card-text>
        <p><b>Serial:</b> {{i.serial}}</p>
        <p><b>MAC:</b> {{i.mac}} </p>
        <p><b>Public IP:</b> {{i.publicIp}}</p>
    </v-card-text>
  </v-card>
</div>
</template>

<script>
  export default {
    data: function () {
      return {
        inventory: []
      }
    },
    computed: {
      org () {
        return this.$store.state.org;
      }
    },
    watch: {
      org: function(){
        this.fetchInventory();
      }
    },
    methods: {
      fetchInventory: function () {
        if(!this.org){
          return;
        }
        this.$meraki.getInventory(this.org.id)
          .then(
            res => {
              this.inventory = res;
              console.log('inventory', this.inventory);
            },
            err => {
              console.log('error getting inventory', err);
            }
          );
      }
    },
    created: function () {
      this.fetchInventory();
    },
  }

</script>
<style>

</style>
