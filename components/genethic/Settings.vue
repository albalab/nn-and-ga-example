<template>
  <v-form ref="form" v-model="valid" class="mx-4" lazy-validation>
    <h2 class="mb-4">Settings</h2>
    <v-text-field
      v-model="phraseToGuess"
      :persistent-hint="true"
      hint="Only english alphabetical characters supported"
      label="Phrase to guess"
    ></v-text-field>

    <v-text-field
      v-model="populationSize"
      class="mt-2"
      label="Population size"
      :persistent-hint="true"
      hint="Number of randomly generated starting phrases (population)"
      type="number"
    ></v-text-field>

    <v-slider
      v-model="mutationRate"
      class="mt-10"
      label="Mutation rate"
      :persistent-hint="true"
      hint="Mutation rate is a genetic operator used to maintain genetic diversity from one generation of a population of genetic algorithm chromosomes to the next (in this particular case it's a possibility to change at a random index character to random one)"
      step="0.001"
      min="0.001"
      max="5"
      thumb-label="always"
    >
      <template #append>
        <v-text-field
          v-model="mutationRate"
          style="margin-top: -32px"
          type="number"
          step="0.001"
          min="0.001"
          max="5"
        ></v-text-field>
      </template>
    </v-slider>

    <v-slider
      v-model="pow"
      class="mt-10 align-center"
      :persistent-hint="true"
      hint="Power of a number is used in normalizing fitness level function to increase chances for better genes to be picked for crossover"
      label="Pow"
      step="1"
      min="1"
      max="1000"
      thumb-label="always"
    >
      <template #append>
        <v-text-field
          v-model="pow"
          style="margin-top: -54px"
          type="number"
          step="1"
          min="1"
          max="1000"
        ></v-text-field>
      </template>
    </v-slider>
    <div class="mt-4">
      <v-btn
        :disabled="!valid || guessing"
        :loading="generating"
        class="primary"
        @click="generatePopulation()"
      >
        Generate population
      </v-btn>
      <v-btn
        :class="guessing ? 'warning' : 'success'"
        :disabled="
          !GA.population ||
          !GA.population.length ||
          (GA && GA.bestWord === GA.phraseToGuess)
        "
        @click="guessing ? pause() : guessPhrase()"
      >
        {{
          guessing
            ? 'Pause guessing'
            : GA.paused
            ? 'Continue guessing'
            : 'Guess phrase'
        }}
      </v-btn>
      <v-btn @click="resetToRecommendedValues">
        Reset to recommended values
      </v-btn>
    </div>
  </v-form>
</template>

<script>
import GenethicAlgorithm from '~/lib/genethic/index.js'

export default {
  data: () => ({
    valid: true,
    phraseToGuess: 'Some random phrase',
    populationSize: 4000,
    population: [],
    mutationRate: 0.1,
    pow: 99,
    generating: false,
    guessing: false,
    GA: {},
  }),
  computed: {
    found() {
      return this.GA.foundIndex
    },
  },
  watch: {
    found(v) {
      if (v >= 0) {
        this.guessing = false
      }
    },
  },
  methods: {
    resetToRecommendedValues() {
      this.phraseToGuess = 'Some random phrase'
      this.populationSize = 2000
      this.mutationRate = 0.01
      this.pow = 99
    },
    generatePopulation() {
      this.generating = true
      setTimeout(() => {
        this.GA = new GenethicAlgorithm(
          this.phraseToGuess,
          this.populationSize,
          this.mutationRate,
          this.pow
        )
        this.GA.generatePopulation()
        this.$emit('generation-populated', this.GA)
        this.generating = false
      }, 200)
    },
    guessPhrase() {
      this.GA.paused = false
      this.guessing = true
      this.GA.startGuessing()
    },
    pause() {
      this.GA.paused = true
      this.guessing = false
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: grid;
  align-items: center;
  justify-items: center;
}
button {
  margin: 5px 5px;
}
</style>
