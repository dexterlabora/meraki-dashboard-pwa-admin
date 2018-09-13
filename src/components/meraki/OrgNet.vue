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
          v-model="form.org"
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
          v-model="form.net"
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
      form: {
        org: {
          id: "",
          name: ""
        },
        net: {
          id: "",
          name: ""
        }
      }
    };
  },
  computed: {
    orgs: function() {
      return this.$store.state.orgs;
    },
    nets: function() {
      return this.$store.state.nets;
    },
    org: function() {
      return this.$store.state.org;
    },
    net: function() {
      return this.$store.state.net;
    }
  },
  watch: {
    apiKey() {
      console.log("orgNet apiKey updated, fetching orgs");
      this.fetchOrgs();
    },
    "form.org"(newVal, oldVal) {
      this.$store.commit("setOrg", newVal);
      this.fetchNets();
    },
    "form.net"(newVal, oldVal) {
      this.$store.commit("setNet", newVal);
    },
    nets() {
      // set default net
      let foundNet;
      foundNet = this.nets.find(n => {
        return n.id === this.net.id;
      });
      console.log("foundNet", foundNet);
      if (!foundNet) {
        console.log(
          "net not found in state for this nets list, setting first net"
        );
        this.form.net = this.nets[0];
      }
    },
    orgs() {
      // set default org
      let foundOrg;
      foundOrg = this.orgs.find(o => {
        return o.id === this.org.id;
      });
      console.log("foundOrg", foundOrg);
      if (!foundOrg) {
        console.log(
          "org not found in state for this orgs list, setting first org"
        );
        this.form.org = this.orgs[0];
      }
    }
  },
  created: function() {
    // Set default selections based on state
    this.form.org = this.org; //|| this.orgs[0] || {};
    this.form.net = this.net; //|| this.nets[0] || {};
    this.fetchOrgs();
  },
  methods: {
    fetchOrgs: function() {
      this.$meraki.getOrganizations().then(res => {
        this.$store.commit("setOrgs", res);
      });
    },
    fetchNets: function() {
      this.$meraki.getNetworks(this.form.org.id).then(res => {
        this.$store.commit("setNets", res);
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





