<template>
<div>
    <h2>Networks</h2>
    <v-btn fab fixed bottom right dark color="primary" :router="true" :to="{ name: 'createNetwork'}">
      <v-icon dark>add</v-icon>
    </v-btn>
    <network-list></network-list>

</div>
</template>

<script>
import NetworkList from './NetworkList.vue'
export default {
  components: {
    NetworkList
  },
	data: function() {
		return {
      
    };
  }
}
</script>
