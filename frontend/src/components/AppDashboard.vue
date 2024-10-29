<script>
    import AppChart from './AppChart.vue'

    export default {
        components: {
            AppChart
        },
        data() {
            return {
                data: []
            }
        },
        methods: {
            addDataPoint() {
                this.data.push({ x: 23, y: 40 })
            }
        },
    }
</script>
<template>
    <h1 class="text-center">Data visualisation dashboard</h1>
    <div>
        <AppChart :data/>
    </div>
    <div>
        <button class="btn btn-primary" @click="addDataPoint()">Btn</button>
    </div>
</template>
