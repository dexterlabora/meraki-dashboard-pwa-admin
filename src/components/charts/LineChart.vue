
<script>
import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: ['chart-labels', 'chart-data'],
  data: function () {
    return {
      chartOptions: {
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false,
        ticks: {
          min: 0
        }
      }
    }
  },
  watch: {
    chartData: function () {
      console.log('rendering chart');
      this.renderChart({
        labels: this.chartLabels, //['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: this.chartData
        /*
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: this.chartData, //[40, 39, 10, 40, 39, 80, 40]
          }
        ]
        */
      }, {responsive: true, maintainAspectRatio: true})
    }
  }
}


</script>