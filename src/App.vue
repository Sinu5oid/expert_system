<template>
  <div id="app" class="ui segment">
    <file-loader v-if="!showMainSegment" @load="parseContent"/>
    <div v-else class="ui secondary segment">
      <div class="ui bulleted list">
        <div
          v-for="(header, idx) in headers"
          :key="'header' + idx"
          class="item">
            {{header}}
        </div>
      </div>
      <div class="ui divider"/>
      <solver :questions="questions" :hypothesises="hypothesises" :max-bound="maxBound"/>
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
      hasContent: false,
      errorMessage: undefined,
      headers: [],
      hypothesises: [],
      questions: [],
      hypothesisesCount: 0,
      maxBound: 5,
    }
  },
  computed: {
    showMainSegment() {
      return this.hasContent && this.headers.length && this.hypothesises.length && this.questions.length;
    },
  },
  methods: {
    parseContent(content) {
      if (!content) {
        console.error('no content provided');
        return;
      }
      this.hasContent = true;
      const lines = content.split('\n');
      const firstBreak = this.findEmptyLine(lines)
      this.headers = lines.splice(0, firstBreak);
      lines.shift();
      const secondBreak = this.findEmptyLine(lines);
      this.questions = lines.splice(0, secondBreak);
      lines.shift();
      if (this.questions && this.questions.length && this.questions[0].includes(':')) {
        this.questions.shift();
      }
      this.hypothesises = this.hypothesisFromFile(lines);
    },
    findEmptyLine(array) {
      return array.findIndex(el => !el || el === '\r');
    },
    hypothesisFromFile(array) {
      this.hypothesisesCount = array.length;
      return array.map(line => {
        line = line.replace('\r', '');
        const parts = line.split(' ');
        const hypothesis = parts[0].replace(',', '');
        parts.splice(0, 2);
        const rules = parts.map(p => {
          const h = p.replace(' ', '').split(',');
          return {
            pPlus: parseFloat(h[1]),
            pMinus: parseFloat(h[2]),
          }
        })
        return {
          hypothesis,
          p: 1 / this.hypothesisesCount,   // init with apriory first
          rules,
        };
      });
    },
  },
}
</script>