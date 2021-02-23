<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <v-stepper-step :complete="step > 1" step="1"> Train </v-stepper-step>

      <v-divider></v-divider>

      <v-stepper-step :complete="step > 2" step="2"> Predict </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items class="mb-6">
      <v-stepper-content step="1">
        <Train @trained="trained($event)" />
      </v-stepper-content>

      <v-stepper-content step="2">
        <Predict :neural-network="neuralNetwork" @go-back="step = 1" />
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import Train from '~/components/nn/Train.vue'
import Predict from '~/components/nn/Predict.vue'
export default {
  components: {
    Train,
    Predict,
  },
  data() {
    return {
      step: 1,
      neuralNetwork: {},
    }
  },
  methods: {
    trained(neuralNetwork) {
      this.neuralNetwork = neuralNetwork
      this.step = 2
    },
  },
}
</script>

<style>
.container {
  display: grid;
  grid-template-columns: 50% 50%;
  text-align: center;
}
</style>
