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
                this.newRange = null;
            }
        }
    };
</script>
<template>
    <form class="row g-3 justify-content-center align-items-end" @submit.prevent="onSubmit">
        <div class="col-auto">
            <label for="currentInputRange" class="form-label">Current Range (%)</label>
            <input type="number" class="form-control" id="currentInputRange" disabled :value="currentRange">
        </div>

        <div class="col-auto">
            <label for="newInputRange" class="form-label">New Range (%)</label>
            <input type="number" required class="form-control" id="newInputRange" v-model="newRange">
        </div>

        <div class="col-auto">
            <button type="submit" class="btn btn-primary">Confirm</button>
        </div>
    </form>
</template>
