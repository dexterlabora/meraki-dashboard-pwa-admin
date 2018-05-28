
<script>
import { Line } from "vue-chartjs";
export default {
  extends: Line,
  props: ["data", "labels"],
  data: function() {
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
    };
  },
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    console.log("mounted: rendering chart");
    this.renderChart(this.data, this.chartOptions);
  },
  watch: {
    data: function() {
      console.log("watch data: rendering chart");
      this.renderChart(this.data, this.chartOptions);
    }
  }
};
</script>