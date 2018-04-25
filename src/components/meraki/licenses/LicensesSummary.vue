<template>
<div> 
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
    <v-card class="lic-card">
      <v-card-title primary-title>
        <div>
        <h3 class="headline mb-0">License Summary</h3>   
        {{org.name}} 
        </div>

      </v-card-title>

      <v-card-text>
        <div>
          <strong>Status:</strong> {{licenses.status}}
          <br>      
          <strong>Expiration:</strong>  {{licenses.expirationDate}}
          <br>
          <strong>Devices Total:</strong>  {{deviceCount}}
        </div>
      </v-card-text>
    </v-card>
    </v-flex>
  </v-layout>
</div>
</template>

<script>
  export default {
    data: function () {
      return {
        licenses: {} 
      }
    },
    computed: {
      org () {
        return this.$store.state.org;
      },
      deviceCount () {
        var count = 0;

        /*
        if(this.licenses.licensedDeviceCounts){
          this.licenses.licensedDeviceCounts.forEach(i => count += this.licenses.licensedDeviceCounts[i]);
        }       
        */

        
        for (var key in this.licenses.licensedDeviceCounts) {
            // skip loop if the property is from prototype
            if (!this.licenses.licensedDeviceCounts.hasOwnProperty(key)) continue;
            count += this.licenses.licensedDeviceCounts[key];
            /*
            var obj = this.licenses.licensedDeviceCounts[key];
            for (var prop in obj) {
                // skip loop if the property is from prototype
                if(!obj.hasOwnProperty(prop)) continue;

                // your code
                //alert(prop + " = " + obj[prop]);
                count+= obj[prop];
            }
            */
        }
        
        return count;
      }
    },
    watch: {
      org: function(){
        this.fetchLicenses();
      }
    },
    methods: {
      fetchLicenses: function () {
        if(!this.org){
          return;
        }

        this.$meraki.getLicenseState(this.org.id)
          .then(
            res => {
              this.licenses = res;
            },
            err => {
              console.log('error getting inventory', err);
            }
          );
      }
    },
    created: function () {
      this.fetchLicenses();
    },
  }

</script>
<style>
.lic-card {
  max-width: 400px;
}
</style>
