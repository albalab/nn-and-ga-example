<template>
  <v-card>
    <v-tabs v-model="tab" background-color="transparent" grow>
      <v-tab v-for="item in items" :key="item">
        {{ item }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <v-tab-item v-for="(item, index) in items" :key="index">
        <NN v-if="index === 0" />
        <Genetic v-if="index === 1" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import NN from '~/components/nn/index.vue'
import Genetic from '~/components/genetic/index.vue'

export default {
  components: {
    NN,
    Genetic,
  },
  data() {
    return {
      tab: null,
      items: [
        'Neural network color classifier',
        'Genetic algorithm phrase guess',
      ],
    }
  },
}
</script>
