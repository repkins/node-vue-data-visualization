<script>
    import Chart from 'chart.js/auto'

    const chartConfig = {
        type: 'line',
        options: {
            animation: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    };

    export default {
        props: ['data'],
        data() {
            return {
                chartConfig,

            }
        },
        mounted() {
            const ctx = this.$refs.chart
            
            this.chart = new Chart(ctx, this.chartConfig)
        },
        watch: {
            data: {
                handler(newValue) {
                    this.chart.data = {
                        labels: newValue.map(r => r.x),
                        datasets: [
                            {
                                data: newValue.map(r => r.y)
                            }
                        ]
                    }
                    this.chart.update()
                },
                deep: true
            }
        }
    }
</script>
<template>
    <canvas ref="chart"></canvas>
</template>
