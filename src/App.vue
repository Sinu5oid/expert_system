<template>
  <div id="app" class="ui segment">
    <file-loader v-if="!contentLoaded" @load="onLoad" @error="onError"/>
    <div v-else class="ui secondary segment">
      <div v-if="errorMessage" class="ui negative error message">
        <div class="header">
          Error occured
        </div>
        {{errorMessage}}
      </div>
      <template v-else>
        <div class="ui bulleted list">
          <div
            v-for="(description, idx) in rules.description"
            :key="'description' + idx"
            class="item">
              {{ description }}
          </div>
        </div>
        <div class="ui divider"/>
        <solver :rules="rules" :max-bound="maxBound"/>
      </template>
    </div>
  </div>
</template>

<script>
import FileLoader from './components/file-loader.vue';
import Solver from './components/solver.vue';

export default {
  name: 'app',
  components: {
    FileLoader,
    Solver,
  },
  data () {
    return {
      contentLoaded: false,
      errorMessage: undefined,
      rules: {
        description: [],
        questions: [],
        hypothesises: [],
      },
      hypothesisesCount: 0,
      maxBound: 5,
    }
  },
  methods: {
    onLoad(content) {
      this.rules = content;
      this.contentLoaded = true;
    },
    onError(message) {
      this.errorMessage = message;
      this.contentLoaded = true;
    }
  },
}
</script>