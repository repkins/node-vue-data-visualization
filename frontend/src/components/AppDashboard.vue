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
            _addDashboardListener(evtName, listener) {
                this.dashboard.addEventListener(evtName, listener)
                this._dashboardListeners.push({ evtName, listener });
            },
            _removeDashboardListeners() {
                for (const { evtName, listener } in this._dashboardListeners) {
                    this.dashboard.removeEventListener(evtName, listener);
                }
                this._dashboardListeners.length = 0;
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
            this._dashboardListeners = [];
            this._addDashboardListener('numbers', this.updateDataFromEvent)
            this._addDashboardListener('range', this.updateRangeFromEvent)
            this._addDashboardListener('connected', this.updateConnectedFromEvent)
            this._addDashboardListener('disconnected', this.updateDisconnectedFromEvent)
        },
        unmounted() {
            this._removeDashboardListeners();
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
