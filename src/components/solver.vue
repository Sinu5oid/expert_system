<template>
  <div class="ui segment">
    <div class="ui grid">
      <div class="eleven wide column">
        <div v-if="!hasResults" class="ui center aligned piled segment">
          <h4 class="ui header">Question {{ step + 1 }}/{{ rules.questions.length }}</h4>
          <p>{{ rules.questions[step].question }}</p>
          <div class="ui buttons">
            <button
              v-for="(answer, idx) in answers"
              :key="idx"
              :class="[{negative: idx === 0}, {positive: idx === answers.length - 1}, {primary: answer === 0}]"
              class="ui button"
              @click="setAnswer(rules.questions[step].idx, answer)">{{ answer }}</button>
          </div>
        </div>
        <div v-else>
          <h1>End of consultation. Please check results</h1>
        </div>
      </div>
      <div class="five wide column">
        <div class="ui center aligned piled segment">
          <table class="ui celled compact table">
            <thead>
              <tr>
                <th>Hypothesis</th>
                <th>P
                  <span class="ui buttons right floated divided">
                    <button
                      :class="{disabled: !mode}"
                      class="ui button"
                      @click="setMode(false)">0.xxxxx</button>
                    <button
                      :class="{disabled: mode}"
                      class="ui button"
                      @click="setMode(true)">xx.xxx%</button>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(h, idx) in displayedList" :key="'hyp' + idx">
                <td>{{ h.hypothesis }}</td>
                <td v-if="mode">{{ 100 * h.p }}%</td>
                <td v-else>{{ h.p }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Solver',
  props: {
    rules: {
      type: Object,
      required: true,
    },
    maxBound: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      hasResults: false,
      step: 0,
      mode: false,        // default = false for float mode, true for percent mode
    };
  },
  computed: {
    displayedList() {
      return this.rules.hypothesises.map(h => ({
        hypothesis: h.hypothesis,
        p: typeof(h.p) === 'number' ? h.p.toFixed(5) : h.p.substring(0, 5),
      })).sort((h1, h2) => h2.p - h1.p);
    },
    answers() {
      const result = [];
      for (let i = -this.maxBound; i <= this.maxBound; i += 1) {
        result.push(i);
      }
      return result;
    },
  },
  methods: {
    setAnswer(idx, answer) {
      this.rules.hypothesises.map(h => {
        if (answer === 0) {
          return h;
        }
        const searchIndex = h.possibilities.findIndex(p => p.question === idx);
        if (searchIndex === -1) {
          return h;
        }

        const ph = h.p;
        const phe = h.possibilities[searchIndex].pPlus * h.p / (h.possibilities[searchIndex].pPlus * h.p + h.possibilities[searchIndex].pMinus * (1 - h.p));
        const phne = (1 - h.possibilities[searchIndex].pPlus) * h.p / ((1 - h.possibilities[searchIndex].pPlus) * h.p + (1 - h.possibilities[searchIndex].pMinus) * (1 - h.p));

        if (answer > 0) {
          h.p = answer * (phe - ph) / this.maxBound + ph;
        } else {
          h.p = answer * (ph - phne) / -this.maxBound + phne;
        }
      });
      if (this.step + 1 >= this.rules.questions.length) {
        this.hasResults = true;
        this.$emit('finish', true);
      }
      this.step += 1;
    },
    setMode(mode) {
      this.mode = mode;
    },
  },
}
</script>