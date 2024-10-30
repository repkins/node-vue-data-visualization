<script>
    import { DashboardKey } from '@/services/dashboard';
    import AppChart from './AppChart.vue'

    export default {
        components: {
            AppChart
        },
        inject: {
            dashboard: { from: DashboardKey }
        },
        data() {
            return {
                data: []
            }
        },
        methods: {
            updateDataFromEvent(evt) {
                const { value, date } = evt.detail;

                this.data.push({ 
                    x: date.toLocaleTimeString(), 
                    y: value 
                })

                if (this.data.length > 10) {
                    this.data.shift()
                }
            },
        },
        created() {
            this.dashboard.addEventListener('number', this.updateDataFromEvent)
        },
        unmounted() {
            this.dashboard.removeEventListener('number', this.updateDataFromEvent)
        }
    }
</script>
<template>
    <h1 class="text-center">Data visualisation dashboard</h1>
    <div>
        <AppChart :data/>
    </div>
</template>
