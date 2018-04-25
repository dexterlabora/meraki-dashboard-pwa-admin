<template>
<div>
  <h2>Traffic Analysis</h2>
  <!-- pie-chart :chart-data="pieChartData"></pie-chart -->
  <h3>{{net.name}}</h3>
  <v-container grid-list-md text-xs-center>
    <div v-if="!loaded">
        Loading Data...
      </div>
      <div v-if="loaded && traffic.length < 1">
        No data available. Ensure Traffic Analtyics is enabled for this network
      </div>
    <v-layout row wrap >
      <v-flex xs12 md6>
        <v-card>
          <v-card-title>Sent and Received</v-card-title>
          <v-card-text p1>
            <pie-chart 
            :chart-data="sentReceivePieChartData.datasets" 
            :chart-labels="sentReceivePieChartData.labels" />
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-card>
          <v-card-title>Flows and Clients</v-card-title>
          <v-card-text p1>
            <pie-chart 
            :chart-data="flowsClientsPieChartData.datasets" 
            :chart-labels="flowsClientsPieChartData.labels" />
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-card>
          <v-card-title>Clients (ToDo)</v-card-title>
          <v-card-text p1>
            <bar-chart 
            :chart-data="flowsClientsPieChartData.datasets" 
            :chart-labels="flowsClientsPieChartData.labels" />
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs12 md6>
        <v-card>
          <v-card-title>Bandwidth (ToDo)</v-card-title>
          <v-card-text p1>
            <line-chart 
            :chart-data="flowsClientsPieChartData.datasets" 
            :chart-labels="flowsClientsPieChartData.labels" />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script>
import PieChart from '../../charts/PieChart'
import LineChart from '../../charts/LineChart.vue'
import DoughnutChart from '../../charts/DoughnutChart.vue'
import BarChart from '../../charts/BarChart.vue'

export default {
  components: {
    PieChart,
    LineChart,
    DoughnutChart,
    BarChart
  },
  watch: {
      net: function () {
        console.log('net changed, fetching traffic');
        this.fetchTraffic();
      }
  },
  computed: {
    net () {
      console.log("state net: ",this.$store.state.net);
      return this.$store.state.net;
    },
    applications () {
      return this.traffic.map(t => t.application)
    },
    sent () {
      return this.traffic.map(t => t.sent)
    },
    recv () {
      return this.traffic.map(t => t.recv)
    },
    flows () {
      return this.traffic.map(t => t.flows)
    },
    clients () {
      return this.traffic.map(t => t.numClients)
    },
    labels () {
      return this.traffic.map(t => {
        // extract details of Miscellaneous secure web
        if (t.application == "Miscellaneous secure web"){
          return t.destination
        }
        return t.application
      })
    },
    sentReceivePieChartData () {
      return {
        labels: this.labels,
        
        datasets: [
          {
            label: 'Received',
            backgroundColor: '#337979',
            data: this.recv
          }, {
            label: 'Sent',
            backgroundColor: '#f87979',
            data: this.sent
          }
        ]
      }
    },
    flowsClientsPieChartData () {
      return {
        labels: this.labels,
        
        datasets: [
          {
            label: 'Received',
            backgroundColor: '#3F7979',
            data: this.flows
          }, {
            label: 'Sent',
            backgroundColor: '#f27979',
            data: this.clients
          }
        ]
      }
    }
  },
  methods: {
    fetchTraffic () {
      if (!this.net.id){ return }
      this.loaded = false;
      this.$meraki.getTraffic(this.net.id, this.timespan)
        .then(
            res => {
              this.traffic = res;
            },
            err => {
              console.log("error getting traffic", err);
            }
          )
        .finally(
          () => {
              this.loaded=false;
          });

      /*
      var url = '/api/networks/'+this.net.id+'/traffic?timespan='+this.timespan;
        this.axios.get(url)
          .then(res => {
            this.traffic = res.data;
            console.log('fetching traffic',this.traffic);
            this.loaded = true;
          }, err => {
            console.log('error getting traffic',err);
            console.log(err.error)
          });
          */
    }
  },
  created: function () {
    this.fetchTraffic();
  },
	data: function () {
		return {
      loaded: false, // state of API data
      traffic : [],
      timespan: '7200',
    };
  }
}
</script>
<style>
.chart {
  height: 80%
}
</style>