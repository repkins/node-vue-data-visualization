<script>
    import { ApiHostKey } from '@/keys';
    import AppChart from './AppChart.vue'

    export default {
        components: {
            AppChart
        },
        inject: {
            apiHost: { from: ApiHostKey }
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
        created() {
            const socket = new WebSocket(`ws://${this.apiHost}`)
            socket.addEventListener('error', () => {
                console.error('Could not connect to API backend')
            })
            socket.addEventListener('message', evt => {
                const {value, timestamp} = JSON.parse(evt.data)
                this.data.push({ 
                    x: new Date(timestamp).toLocaleTimeString(), 
                    y: value 
                })

                if (this.data.length > 10) {
                    this.data.shift()
                }
            })

            this.socket = socket
        },
        unmounted() {
            this.socket.close()
        }
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
