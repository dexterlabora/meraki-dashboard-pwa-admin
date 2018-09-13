<!-- Sets the Organization and Network state for the app -->
<template>
<div>
  <v-list> 
    <v-list-tile avatar>
      <v-list-tile-content>
        <v-select 
          v-bind:items="orgs"
          item-text="name"
          item-value="id"
          return-object
          v-model="org"
          label="Organizations"
        ></v-select>
      </v-list-tile-content>
    </v-list-tile>
      <v-list-tile avatar>
      <v-list-tile-content>
        <v-select
          v-bind:items="nets"
          item-text="name"
          item-value="id"
          return-object
          v-model="net"
          label="Networks"
        ></v-select>
      </v-list-tile-content>
    </v-list-tile>
  </v-list>

</div>
</template>

<script>
export default {
  data: function() {
    return {
      org: {
        id: "",
        name: ""
      },
      net: {
        id: "",
        name: ""
      }
    };
  },
  computed: {
    apiKey: function() {
      return this.$store.state.apiKey;
    },
    orgs: function() {
      return this.$store.state.orgs;
    },
    nets: function() {
      return this.$store.state.nets;
    }
  },
  watch: {
    org() {
      // New org selected, fetch related networks
      this.fetchNets();
      this.$store.commit("setOrg", this.org);
    },
    net() {
      console.log("orgnet update state: net", this.net);
      this.$store.commit("setNet", this.net);
    },
    orgs() {
      this.org = this.orgs[0]; // set default org
      this.fetchNets();
      this.$store.commit("setOrgs", this.orgs);
    },
    nets() {
      console.log("orgnet update state: net", this.nets);
      this.$store.commit("setNets", this.nets);
    },
    apiKey() {
      console.log("orgNet apiKey updated, fetching orgs");
      this.fetchOrgs();
    }
  },
  created: function() {
    // Set default selections based on state
    this.org = this.$store.state.org || this.orgs[0] || {};
    this.net = this.$store.state.net || this.nets[0] || {};
    this.fetchOrgs();
  },
  methods: {
    fetchOrgs: function() {
      this.$meraki
        .getOrganizations()
        .then(res => {
          //this.orgs = res;
          this.$store.commit("setOrgs", res);
          console.log("orgs:", this.orgs);
          console.log("orgs[0]:", this.orgs[0]);
          //this.org = this.org ? this.org : this.orgs[0]; // set default
        })
        .catch(e => {
          console.log("fetchOrgs error", e);
        });
    },
    fetchNets: function() {
      this.$meraki.getNetworks(this.org.id).then(res => {
        this.$store.commit("setNets", res);
        this.net =
          this.net.organizationId == this.org.id ? this.net : this.nets[0]; // set default
      });
    }
  }
};
</script>
<style>
.list {
  color: #0f0101;
}
</style>





