<script lang="ts">
import { Component, Vue, Prop, Watch, mixins } from "nuxt-property-decorator";
import Chart from "chart.js";
import VueChart from "vue-chartjs";
const Bar = VueChart.Bar;
const reactiveProp = VueChart.mixins.reactiveProp;

@Component
// mixinsもBarに変更
export default class ChartLine extends mixins(Bar, reactiveProp) {
  @Prop({ default: {} }) chartData!: Chart.ChartData;
  @Prop({ default: {} }) options!: Chart.ChartOptions;

  mounted() {
    this.renderChart(this.chartData, this.options);
  }

  @Watch('options', {deep: true, immediate: false})
  getOptions() {
    this.renderChart(this.chartData, this.options);
  }
}
</script>