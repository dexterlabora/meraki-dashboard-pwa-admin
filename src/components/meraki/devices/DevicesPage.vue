<template>
<div>
    <h2>Devices</h2>
    
    <devices-table></devices-table>
</div>
</template>

<script>
import DevicesTable from "./DevicesTable.vue";
export default {
  components: {
    DevicesTable
  },
  data: function() {
    return {};
  }
};
</script>
