<template>
  <div id="app" class="ui segment">
    <file-loader v-if="!contentLoaded" @load="onLoad" @error="onError"/>
    <div v-if="errorMessage" class="ui secondary segment">
      <div class="ui negative error message">
        <div class="header">
          Error occured
        </div>
        {{errorMessage}}
      </div>
    </div>
    <template v-else-if="contentLoaded">
      <div class="ui secondary segment">
        <div class="ui bulleted list">
          <div
            v-for="(description, idx) in rules.description"
            :key="'description' + idx"
            class="item">
              {{ description }}
          </div>
        </div>
        <div class="ui divider"/>
        <solver :rules="rules" :max-bound="maxBound" @finish="onFinish"/>
      </div>
    </template>
    <div class="ui basic modal">
      <div class="ui icon header">
        <i class="redo icon"></i>
        Reload the page?
      </div>
      <div class="content">
        <p>Consultation has been ended</p>
        <p>You can reload the page now or later yourself using the browser buttons</p>
      </div>
      <div class="actions">
        <div class="ui red basic cancel inverted button">
          <i class="window close icon"></i>
          Close this modal
        </div>
        <div class="ui green ok inverted button" @click="reloadPage">
          <i class="redo icon"></i>
          Reload the page
        </div>
      </div>
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
      hasResults: false,
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
    },
    onFinish(result) {
      setTimeout(() => {
        $('.ui.basic.modal').modal('show');
      }, 500);
    },
    reloadPage() {
      window.location.reload(true);
    }
  },
}
</script>