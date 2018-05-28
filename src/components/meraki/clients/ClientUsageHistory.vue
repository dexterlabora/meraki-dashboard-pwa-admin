<template>
    <v-container>
        <v-layout>
        <v-flex xs12 md12>
        <v-card>
          <v-card-title>Client Usage History</v-card-title>
          <v-card-text p1>
            <line-chart 
            label="Sent and Received by Day"
            :data="chartData"
            />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ["netId", "client"],
  mounted() {
    this.$meraki
      .getClientUsageHistory(this.netId, this.client)
      .then(res => (this.clientUsage = res));
  },
  data() {
    return {
      //client: "0c:8d:db:95:8b:83",
      clientUsage: []
      /*
      clientUsage: [
        {
          received: null,
          sent: null,
          ts: 1525824000
        },
        {
          received: 124343,
          sent: 1534516,
          ts: 1525910400
        },
        {
          received: 2314324,
          sent: 103459,
          ts: 1525996800
        },
        {
          received: 134234534,
          sent: 153523,
          ts: 1526083200
        },
        {
          received: 1234,
          sent: 153517,
          ts: 1526169600
        },
        {
          received: 43542356,
          sent: 154333,
          ts: 1526256000
        },
        {
          received: 124534,
          sent: 11249,
          ts: 1526342400
        },
        {
          received: 4346346,
          sent: 104,
          ts: 1526428800
        },
        {
          received: 4435345,
          sent: 122,
          ts: 1526515200
        },
        {
          received: 532425,
          sent: 123423431,
          ts: 1526601600
        },
        {
          received: 345345,
          sent: 132423432,
          ts: 1526688000
        },
        {
          received: 345,
          sent: 135,
          ts: 1526774400
        },
        {
          received: 34534,
          sent: 108,
          ts: 1526860800
        },
        {
          received: 3254,
          sent: 123423419,
          ts: 1526947200
        },
        {
          received: 45543,
          sent: 125,
          ts: 1527033600
        },
        {
          received: 34355,
          sent: 23423234,
          ts: 1527120000
        },
        {
          received: 324355,
          sent: 135,
          ts: 1527206400
        }
      ]
      */
    };
  },
  computed: {
    net() {
      return this.$store.state.net;
    },
    chartDataExample() {
      return [
        {
          name: "Sent",
          data: {
            "2017-01-01 00:00:00 -0800": 31243,
            "2017-01-02 00:00:00 -0800": 41245
          }
        },
        {
          name: "Received",
          data: {
            "2017-01-01 00:00:00 -0800": 5435,
            "2017-01-02 00:00:00 -0800": 32314
          }
        }
      ];
    },
    chartData() {
      return [
        {
          name: "Sent",
          data: this.usageSent
        },
        {
          name: "Received",
          data: this.usageReceived
        }
      ];
    },
    usageReceived() {
      // "{'2017-05-13': 2, '2017-05-14': 5}"
      let obj = {};
      this.clientUsage.forEach(c => {
        obj[new Date(c.ts * 1000).toISOString().split("T")[0]] = c.received;
      });
      return obj;
    },
    usageSent() {
      // "{'2017-05-13': 2, '2017-05-14': 5}"
      let obj = {};
      this.clientUsage.forEach(c => {
        obj[new Date(c.ts * 1000).toISOString().split("T")[0]] = c.sent;
      });
      return obj;
    }
  }
};
</script>

<style scoped>
</style>