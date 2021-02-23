<template>
  <div>
    <h2 class="mb-4">Visualization</h2>
    <v-container>
      <p><span class="font-weight-bold">Cycle:</span> {{ ga.cycle }}</p>
      <p
        v-if="ga.phraseToGuess && ga.phraseToGuess === ga.bestWord"
        class="font-weight-bold primary"
      >
        Found:
        {{ ga.phraseToGuess }}
      </p>
      <p v-else>
        <span class="font-weight-bold">Best word:</span> {{ ga.bestWord }}
      </p>
      <p>
        <span class="font-weight-bold">Average fitness level:</span>
        {{ ga.averageFitnessRate }}
      </p>
      <p>
        <span class="font-weight-bold">Best fitness level:</span>
        {{ ga.bestFitnessRate }}
      </p>
    </v-container>
    <v-simple-table fixed-header height="600px">
      <template #default>
        <thead>
          <tr>
            <th class="text-center">Phrase</th>
            <th class="text-center">Fitness level</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in ga.population" :key="p.randomPhrase + i">
            <td :class="p.randomPhrase === ga.phraseToGuess ? 'primary' : null">
              {{ p.randomPhrase }}
            </td>
            <td>{{ p.fitnessRate }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  props: {
    ga: {
      type: Object,
      required: true,
    },
  },
}
</script>
