<script>
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const chartConfig = {
  type: 'line',
  options: {
    animation: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'time',
        ticks: {
          source: 'data',
          callback(value) {
            return new Date(value).toLocaleTimeString('lv-LV');
          },
        },
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
      },
    },
  },
};

export default {
  props: ['data'],
  data() {
    return {
      chartConfig,
    };
  },
  watch: {
    data: {
      handler(newValue) {
        this.chart.data = {
          datasets: [
            {
              data: [...newValue],
            },
          ],
        };
        this.chart.update();
      },
      deep: true,
    },
  },
  mounted() {
    const ctx = this.$refs.chart;

    this.chart = new Chart(ctx, this.chartConfig);
  },
};
</script>
<template>
  <canvas ref="chart" />
</template>
