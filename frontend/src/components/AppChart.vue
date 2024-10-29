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
            },
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: 100
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
                        datasets: [
                            {
                                data: [ ...newValue ],
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
