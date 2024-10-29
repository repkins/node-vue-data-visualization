<script>
    export default {
        data() {
            return {
                count: 0
            }
        },
        methods: {
            increment() {
                this.count++;
            }
        }
    }
</script>

<template>
    <h1>Hello, Bootstrap and Vite!</h1>
    <button class="btn btn-primary" @click="increment()">{{ count }}</button>
</template>
