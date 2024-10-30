<script>
    import { DashboardKey } from '@/services/dashboard';
    import AppChart from './AppChart.vue'
    import AppDashboardForm from './AppDashboardForm.vue';

    export default {
        components: {
            AppChart, AppDashboardForm
        },
        inject: {
            dashboard: { from: DashboardKey }
        },
        data() {
            return {
                data: [],
                rangePercentage: null
            }
        },
        methods: {
            onNewRange(newRangePercentage) {
                this.dashboard.updateRange(newRangePercentage);
            },
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
            updateRangeFromEvent(evt) {
                const { percentage } = evt.detail;
                this.rangePercentage = percentage;
            }
        },
        created() {
            this.dashboard.addEventListener('number', this.updateDataFromEvent)
            this.dashboard.addEventListener('range', this.updateRangeFromEvent)
        },
        unmounted() {
            this.dashboard.removeEventListener('number', this.updateDataFromEvent)
            this.dashboard.removeEventListener('range', this.updateRangeFromEvent)
        }
    }
</script>
<template>
    <h1 class="text-center mb-4">Data visualisation dashboard</h1>
    <AppDashboardForm :current-range="rangePercentage" @new-range="onNewRange"/>
    <div>
        <AppChart :data/>
    </div>
</template>
