<script>
import { DashboardKey } from '../services/dashboard';
import AppChart from './AppChart.vue';
import AppDashboardForm from './AppDashboardForm.vue';

const MaxDataPoints = 15;

export default {
  components: {
    AppChart, AppDashboardForm,
  },
  inject: {
    dashboard: { from: DashboardKey },
  },
  data() {
    return {
      data: [],
      rangePercentage: null,
      connected: false,
      dateLoaded: null,
    };
  },
  created() {
    this.dashboardListeners = [];
  },
  mounted() {
    this.addDashboardListener('numbers', this.updateDataFromEvent);
    this.addDashboardListener('range', this.updateRangeFromEvent);
    this.addDashboardListener('connected', this.updateConnectedFromEvent);
    this.addDashboardListener('disconnected', this.updateDisconnectedFromEvent);
    this.addDashboardListener('dataLoaded', this.updateDateLoadedFromEvent);
  },
  unmounted() {
    this.removeDashboardListeners();
  },
  methods: {
    onNewRange(newRangePercentage) {
      this.dashboard.updateRange(newRangePercentage);
    },
    addDashboardListener(evtName, listener) {
      this.dashboard.addEventListener(evtName, listener);
      this.dashboardListeners.push({ evtName, listener });
    },
    removeDashboardListeners() {
      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (const { evtName, listener } in this.dashboardListeners) {
        this.dashboard.removeEventListener(evtName, listener);
      }
      this.dashboardListeners.length = 0;
    },
    updateDataFromEvent(evt) {
      const numberEntries = evt.detail;

      const newDataPoints = numberEntries
        .map(({ value, date }) => ({
          x: date,
          y: value,
        }));

      this.data.push(...newDataPoints);

      if (this.data.length > MaxDataPoints) {
        this.data.splice(0, this.data.length - MaxDataPoints);
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
    },
    updateDateLoadedFromEvent(evt) {
      const { date } = evt.detail;
      this.dateLoaded = date.toLocaleTimeString('lv-LV');
    },
  },
};
</script>
<template>
  <h1 class="text-center mb-4">Data visualisation dashboard</h1>

  <p class="text-center text-success" v-if="connected">
    Connected to backend
    <span v-if="dateLoaded">(loaded at {{ dateLoaded }})</span>
  </p>
  <p class="text-center text-danger" v-if="!connected">Not connected to backend</p>

  <AppDashboardForm :curr-range="rangePercentage" @new-range="onNewRange"/>
  <div>
      <AppChart :data/>
  </div>
</template>
