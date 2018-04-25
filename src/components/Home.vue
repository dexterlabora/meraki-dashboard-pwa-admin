<template>
<v-container fluid grid-list-md>
  <v-layout row wrap>
      <v-flex xs12 md12>
        <welcome></welcome>
      </v-flex>
      <v-flex xs12 md12>
        <licenses-summary></licenses-summary>
      </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import Welcome from './Welcome.vue'
import LicensesSummary from './meraki/licenses/LicensesSummary.vue'

export default {
  components: {
    Welcome,
    LicensesSummary
  },
  data: function() {
    return {
      title: 'Meraki API Vue Demo App'
    }
  }
}
</script>
