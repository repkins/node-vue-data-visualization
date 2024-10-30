<script>

    export default {
        props: ['currentRange'],
        emits: ['newRange'],
        data() {
            return {
                newRange: null
            }
        },
        methods: {
            onSubmit() {
                this.$emit('newRange', this.newRange);
            }
        }
    };
</script>
<template>
    <form class="row g-3 justify-content-center align-items-end" @submit.prevent="onSubmit">
        <div class="col-auto">
            <label for="inputRangePercentage" class="form-label">Current Range (%)</label>
            <input type="number" class="form-control" id="inputRangePercentage" disabled :value="currentRange">
        </div>

        <div class="col-auto">
            <label for="inputRangePercentage" class="form-label">New Range (%)</label>
            <input type="number" required class="form-control" id="inputRangePercentage" v-model="newRange">
        </div>

        <div class="col-auto">
            <button type="submit" class="btn btn-primary">Confirm</button>
        </div>
    </form>
</template>
