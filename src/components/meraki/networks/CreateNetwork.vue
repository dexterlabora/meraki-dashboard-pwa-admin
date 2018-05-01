<template>
    <v-layout>
        <v-flex xs6>
            <v-card>
            <v-card-title primary-title class="headline mb-0"><h5>Create Network</h5></v-card-title>
            <v-card-text>
                <v-text-field
                name="name"
                label="Network Name"
                v-model="networkForm.name"
                ></v-text-field>
                <v-text-field
                name="tags"
                label="Tags"
                v-model="networkForm.tags"
                ></v-text-field>
                <v-select
                v-bind:items="networkFormOptions.types"
                v-model="networkForm.type"
                label="Type"
                single-line
                multiple
                bottom
                ></v-select>
                <v-select
                v-bind:items="networkFormOptions.timeZones"
                v-model="networkForm.timeZone"
                label="Time Zone"
                single-line
                bottom
                ></v-select>
            </v-card-text>
            <v-card-actions>
                <v-btn color="orange" @click="submitNetworkForm()">Create</v-btn>
                <v-btn color="orange" :router="true" :to="{ name: 'networks'}">Cancel</v-btn>
            </v-card-actions>                   
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>

export default {
  data() {
    return {
      networkForm: {
          name: '',
          tags: '',
          timeZone: '',
          type: []
      },
      networkFormOptions: {
        types: ["wireless", "switch", "appliance", "phone"],
        timeZones: this.$moment.tz.names()
      }
    };
  },
  computed: {
    org() {
      return this.$store.state.org;
    }
  },
  methods: {
    submitNetworkForm() {
      this.$meraki.createNetwork(this.org.id, {
        name: this.networkForm.name,
        tags: this.networkForm.tags,
        timeZone: this.networkForm.timeZone,
        type: this.networkForm.type.join(" ")
      });
    }
  }
};
</script>

