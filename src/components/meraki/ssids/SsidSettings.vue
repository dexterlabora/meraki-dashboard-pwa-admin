<template>
  <v-card>
      <v-list-tile avatar>
        <v-list-tile-action>
          <v-switch v-model="ssidForm.enabled"></v-switch>
        </v-list-tile-action>
        <v-list-tile-content>
          
          <v-list-tile-title>Enable Network</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-list two-line subheader>
      <v-subheader>General</v-subheader>
      <v-list-tile avatar>
        <v-list-tile-content>
          <v-text-field
            v-model="ssidForm.name"
            label="SSID Name"
            required
          ></v-text-field>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile avatar v-if="ssidForm.authMode == 'psk'">
        <v-list-tile-content>
          <v-text-field
                v-model="ssidForm.psk"
                label="Pre-shared key"
              ></v-text-field>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
      
    <v-list two-line subheader >
      <v-divider></v-divider>
      <v-subheader>Advanced Settings</v-subheader>
      <v-list-tile avatar>
        <v-list-tile-content>
          <v-select 
            v-bind:items="ssidOptions.authMode"
            return-object
            v-model="ssidForm.authMode"
            label="Authentication"
          ></v-select>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile avatar>
        <v-list-tile-content>
          <v-select 
            v-bind:items="ssidOptions.encryptionMode"
            return-object
            v-model="ssidForm.encryptionMode"
            label="Encryption"
          ></v-select>
        </v-list-tile-content>
      </v-list-tile>
      
      <v-list-tile avatar>
        <v-list-tile-content>
          <v-select 
            v-bind:items="ssidOptions.wpaEncryptionMode"
            return-object
            v-model="ssidForm.wpaEncryptionMode"
            label="WPA Encryption"
          ></v-select>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>

    <v-divider></v-divider>
    <v-list two-line subheader >
      <v-subheader>Splash Page</v-subheader>

      <v-list-tile avatar>
        <v-list-tile-content>
          <v-select 
            v-bind:items="ssidOptions.splashPage"
            return-object
            v-model="ssidForm.splashPage"
            label="Method"
          ></v-select>
        </v-list-tile-content>      
      </v-list-tile>

      <v-list-tile avatar>
        <v-list-tile-action>
          <v-checkbox v-model="ssidForm.walledGardenEnabled"></v-checkbox>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Walled Garden</v-list-tile-title>
          <v-list-tile-sub-title>Allow access to remote servers prior to authentication</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-list-tile avatar v-if="ssidForm.walledGardenEnabled">
        <v-list-tile-content>
          <v-list-tile-title>Walled Garden Ranges</v-list-tile-title>
          <v-text-field
                v-model="ssidForm.walledGardenRanges"
                label="e.g. 192.168.1.1/24 192.168.37.10/32"
              ></v-text-field>
        </v-list-tile-content>      
      </v-list-tile>

    </v-list>
    <v-divider></v-divider>
    <v-list two-line subheader >
      <v-subheader>Radio Settings</v-subheader>

      <v-list-tile avatar>
        <v-list-tile-content>
          <v-select 
            v-bind:items="ssidOptions.minBitrate"
            return-object
            v-model="ssidForm.minBitrate"
            label="Minimum bitrate"
          ></v-select>
        </v-list-tile-content>      
      </v-list-tile>

      <v-list-tile avatar>
        <v-list-tile-content>
          <v-select 
            v-bind:items="ssidOptions.bandSelection"
            return-object
            v-model="ssidForm.bandSelection"
            label="Band Selection"
          ></v-select>
        </v-list-tile-content>      
      </v-list-tile>        
    </v-list>   
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue darken-1" flat @click.native="cancel">Cancel</v-btn>
      <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
    </v-card-actions>       
  </v-card>  
</template>



<script>
import EventBus from "@/eventhub.js";
export default {
  props: {
    initForm: {
      type: Object
    }
  },
  data: function() {
    return {
      ssidNum: 0,
      ssidForm: Object.assign({}, this.initForm),
      ssidOptions: {
        authMode: [
          "open",
          "psk",
          "open-with-radius",
          "8021x-meraki",
          "8021x-radius"
        ],
        encryptionMode: ["wpa", "wep", "wpa-eap"],
        psk: String,
        wpaEncryptionMode: ["WPA1 and WPA2", "WPA2 only"],
        splashPage: [
          "None",
          "Click-through splash page",
          "Billing",
          "Password-protected with Meraki RADIUS",
          "Password-protected with custom RADIUS",
          "Password-protected with Active Directory",
          "Password-protected with LDAP",
          "SMS authentication",
          "Systems Manager Sentry",
          "Facebook Wi-Fi"
        ],
        minBitrate: [1, 2, 5.5, 6, 9, 11, 12, 18, 24, 36, 48, 54],
        bandSelection: [
          "Dual band operation",
          "5 GHz band only",
          "Dual band operation with Band Steering"
        ]
      }
    };
  },

  watch: {
    initForm() {
      this.ssidForm = this.initForm;
    }
  },
  methods: {
    cancel() {
      this.$emit("cancel");
    },
    save() {
      console.log("sending form changes", this.ssidForm);
      this.$emit("save", this.ssidForm);
    }
    /*
    updateSsid: function($index) {
      console.log("updating SSID ", this.ssid);
      if (this.ssid) {
        this.ssidNum = this.ssidForm.number; // save SSID number for use after refresh
        this.$meraki
          .updateSsid(this.net.id, this.ssidForm.number, this.ssidForm)
          .then(res => {
            this.fetchSsids(); // get clean copy of SSID list and update form
            console.log("SSID updated!", res);
          });
      } else {
        console.log("failed to update SSID", this.ssidForm.number);
      }
    }
    */
  }
};
</script>
