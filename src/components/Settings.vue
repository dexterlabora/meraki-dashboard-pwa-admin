<template>
    <v-menu
      offset-x
      :close-on-content-click="false"
      :nudge-width="400"
      v-model="menu"
    >     
      <v-btn icon dark slot="activator">
        <v-icon>lock</v-icon>
      </v-btn>
      <v-card>

        <v-card-title>Admin Settings</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <i>Changes saved in browser storage</i>
          <v-list class="mt-2">
            <v-list-tile>
              <v-list-tile-sub-title>
                <v-text-field
                name="apiKey"
                label="API KEY"
                id="apiKey"
                v-model="form.apiKey"
                ></v-text-field>
              </v-list-tile-sub-title>
            </v-list-tile>
          
            <v-list-tile class="mt-2">
              <v-list-tile-sub-title>
                <v-checkbox
                  label="Admin Mode"
                  v-model="form.adminMode"
                ></v-checkbox>
              </v-list-tile-sub-title>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn flat @click="menu = false">Cancel</v-btn>
          <v-btn color="primary" flat @click="saveSettings()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

</template>

<script>
  module.exports = {
    data: function() {
		  return {    
        fav: true,
        menu: false,
        message: false,
        hints: true,
        form: {
          apiKey: '',
          adminMode: false,
        }
      }
    },
    computed: {
      adminMode: function(){
        return this.$store.state.adminMode;
      },
      apiKey: function () {
        return this.$store.state.apiKey;
      }
    },
    created: function () {
      this.form.apiKey = this.apiKey;
      this.form.adminMode = this.adminMode;
    },
    methods: {
      saveSettings () {
        console.log("save settings ");

        //console.log('store apiKey', this.$store.state.apiKey);
        //this.$store.state.apiKey = this.form.apiKey;    
        this.$store.commit('setApiKey', this.form.apiKey);  
    
        console.log('store adminMode', this.$store.state.adminMode);
        this.$store.commit('setAdminMode', this.form.adminMode); 
        // close setting menu
        this.menu = false;
      }
    }
  }
</script>