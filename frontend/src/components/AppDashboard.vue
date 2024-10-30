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
            onNewRange(newRange) {
                console.log(newRange);
            }
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
    <h1 class="text-center mb-4">Data visualisation dashboard</h1>
    <AppDashboardForm :current-range="30" @new-range="onNewRange"/>
    <div>
        <AppChart :data/>
    </div>
</template>
