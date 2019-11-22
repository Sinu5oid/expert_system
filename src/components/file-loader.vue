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
import { parseFromMkb, parseFromJson } from '../utils/json-helper.js';

export default {
  name: 'FileLoader',
  data() {
    return {
      isLoading: false,
    };
  },
  methods: {
    selectFile(event) {
      try {
        if (!event.target.files.length) {
          return;
        }
        const fileName = event.target.files[0].name;
        if (!fileName.includes('.mkb') && !fileName.includes('.json')) {
          throw Error('incompatible content');
        }
        const reader = new FileReader();
        reader.onload = e => {
          this.isLoading = true;
          setTimeout(() => {
            try {
              const object = reader.result;
              let json;
              if (fileName.includes('.mkb')) {
                const fromMkb = parseFromMkb(object);
                json = JSON.stringify(fromMkb, null, 2);
                this.download(json, `${fileName.replace('.mkb', '')}.json`, 'application/json');
                this.$emit('load', fromMkb);
              } else {
                json = parseFromJson(object);
                this.$emit('load', json);
              }
            } catch (error) {
              this.$emit('error', error.message);
            } finally {
              this.isLoading = false;
            }
          }, 500);
        }
        const encoding = fileName.includes('.mkb') ? 'Windows-1251' : 'UTF-8';
        reader.readAsText(event.target.files[0], encoding);
      } catch (error) {
        this.$emit('error', error.message);
      }
    },
    download(content, fileName, contentType) {
      try {
        const a = document.createElement("a");
        const file = new Blob([content], {type: contentType});
        a.href = URL.createObjectURL(file);
        a.download = fileName;
        a.click();
      } catch (error) {
        this.$emit('error', error.message);
      }
    },
  },
}
</script>