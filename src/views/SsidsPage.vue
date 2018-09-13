<template>
<div>
    <h2>SSIDs</h2>
        <ssids-table></ssids-table>  
</div>
</template>
<script>
import SsidsTable from "../components/meraki/ssids/SsidsTable.vue";

export default {
  components: {
    SsidsTable
  },
  data: function() {
    return {};
  }
};
</script>
