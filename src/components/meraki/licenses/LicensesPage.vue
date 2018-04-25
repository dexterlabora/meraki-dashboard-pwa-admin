<template>
<div>
<h2>Licenses</h2>



<v-container grid-list-md text-xs-center>
    <v-layout row wrap>
      <v-flex xs12>
        <licenses-summary></licenses-summary>
      </v-flex>
      <v-flex xs12>
        <licenses-devices></licenses-devices>
      </v-flex>
    </v-layout>
</v-container>
</div>
</template>
<script>

import LicensesSummary from './LicensesSummary.vue'
import LicensesDevices from './LicensesDevices.vue'

export default {
  components: {
    LicensesSummary,
    LicensesDevices
  },
	data: function() {
		return {
      
    };
  }
}

</script>
