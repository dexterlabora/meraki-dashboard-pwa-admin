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

        <v-snackbar
            :timeout="3000"
            top
            multi-line
            :color="snackbar.color"
            v-model="snackbar.active"
            >
            <h3>{{ snackbar.status }}</h3>
            {{ snackbar.text }}
            <v-btn flat color="white" @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
    </v-layout>
</template>

<script>
var moment = require('moment');

export default {
    data: function () {
        return {
            networkForm: {},
            networkFormOptions: {
                types: ['wireless', 'switch', 'appliance', 'phone'],
                timeZones: moment.tz.names()
            },
            snackbar: {
                active: false,
                color: ''
            }
        }
    },
    computed: {
      org () {
        return this.$store.state.org;
      }
    },
    methods: {
        createNetwork (orgId, data) {
            this.axios.post('/api/organizations/'+orgId+'/networks', data )
            .then(response => {
                console.log('createNetwork response', response.data);
                this.networkForm = {}; // clear form
                this.notify("success","Network Created");
                this.$eventHub.$emit('netCreated', response.data);
            })
            .catch(e => {
                this.notify("error","Failed to create network");
                this.errors.push(e)
          })
        },
        submitNetworkForm(){
            this.createNetwork (this.org.id, {
                name: this.networkForm.name,
                tags: this.networkForm.tags,
                timeZone: this.networkForm.timeZone,
                type: this.networkForm.type
           })
        },
        notify(status, text) {
            this.snackbar.text = text;        
            this.snackbar.color = status;
            this.snackbar.active = true;
        }
    }
}
</script>

