<template>
    <div class="ui placeholder segment" :class="[{loading: isLoading}]">
        <div class="ui icon header">
            <i class="file icon"></i>
            Select a file
        </div>
        <div class="field">
            <input name="inputFile" type="file" id="file_input" @change="selectFile($event)">
        </div>
    </div>
</template>
<script>
export default {
    name: 'FileLoader',
    data() {
        return {
            isLoading: false,
        };
    },
    methods: {
        selectFile(event) {
            if (!event.target.files.length) {
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => {
                this.isLoading = true;
                setTimeout(() => {
                    this.isLoading = false;
                    this.$emit('load', e.target.result);
                }, 500)
            };
            reader.readAsText(event.target.files[0], 'Windows-1251');
        },
    }
}
</script>