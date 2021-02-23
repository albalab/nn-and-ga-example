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
        <Genethic v-if="index === 1" />
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import NN from '~/components/nn/index.vue'
import Genethic from '~/components/genethic/index.vue'

export default {
  components: {
    NN,
    Genethic,
  },
  data() {
    return {
      tab: null,
      items: [
        'Neural network color classifier',
        'Genethic algorithm phrase guess',
      ],
    }
  },
}
</script>
