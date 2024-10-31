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
                rangePercentage: null,
                connected: false
            }
        },
        methods: {
            onNewRange(newRangePercentage) {
                this.dashboard.updateRange(newRangePercentage);
            },
            updateDataFromEvent(evt) {
                const numberEntries = evt.detail;

                const newDataPoints = numberEntries
                    .map(({ value, date }) => ({ 
                        x: date,
                        y: value 
                    }));

                this.data.push(...newDataPoints);

                const maxDataPoints = 15;

                if (this.data.length > maxDataPoints) {
                    this.data.splice(0, this.data.length - maxDataPoints);
                }
            },
            updateRangeFromEvent(evt) {
                const { percentage } = evt.detail;
                this.rangePercentage = percentage;
            },
            updateConnectedFromEvent() {
                this.connected = true;
            },
            updateDisconnectedFromEvent() {
                this.connected = false;
            }
        },
        created() {
            this.dashboard.addEventListener('numbers', this.updateDataFromEvent)
            this.dashboard.addEventListener('range', this.updateRangeFromEvent)
            this.dashboard.addEventListener('connected', this.updateConnectedFromEvent)
            this.dashboard.addEventListener('disconnected', this.updateDisconnectedFromEvent)
        },
        unmounted() {
            this.dashboard.removeEventListener('numbers', this.updateDataFromEvent)
            this.dashboard.removeEventListener('range', this.updateRangeFromEvent)
            this.dashboard.removeEventListener('connected', this.updateConnectedFromEvent)
            this.dashboard.removeEventListener('disconnected', this.updateDisconnectedFromEvent)
        }
    }
</script>
<template>
    <h1 class="text-center mb-4">Data visualisation dashboard</h1>
    <p class="text-center text-success" v-if="connected">Connected to backend</p>
    <p class="text-center text-danger" v-if="!connected">Not connected to backend</p>
    <AppDashboardForm :current-range="rangePercentage" @new-range="onNewRange"/>
    <div>
        <AppChart :data/>
    </div>
</template>
