<template>
  <div class="wrapper">
    <v-form ref="form" v-model="valid" class="mx-4" lazy-validation>
      <h2 class="mb-4">Training settings</h2>
      <v-text-field
        v-model="inputNodes"
        label="Input nodes"
        :persistent-hint="true"
        hint="Predefined value that cannot be changed, [R,G,B] color saturation"
        disabled
      ></v-text-field>

      <v-slider
        v-model="hiddenNodes"
        class="mt-10 align-center"
        label="Hidden nodes"
        min="1"
        max="1000"
        :persistent-hint="true"
        hint="Number of hidden nodes in a single layer neural network"
        thumb-label="always"
      >
        <template #append>
          <v-text-field
            v-model="hiddenNodes"
            style="margin-top: -45px"
            type="number"
            min="1"
            max="1000"
          ></v-text-field>
        </template>
      </v-slider>

      <v-text-field
        v-model="outputNodes"
        label="Output nodes"
        :persistent-hint="true"
        :hint="outputNodesHint"
        disabled
      ></v-text-field>
      <v-slider
        v-model="learningRate"
        class="mt-10 align-center"
        label="Learning rate"
        :persistent-hint="true"
        hint="The learning rate defines the size of the corrective steps that the model takes to adjust for errors in each observation."
        step="0.001"
        min="0.001"
        max="5"
        thumb-label="always"
      >
        <template #append>
          <v-text-field
            v-model="learningRate"
            style="margin-top: -44px"
            type="number"
            step="0.001"
            min="0.001"
            max="5"
          ></v-text-field>
        </template>
      </v-slider>
      <v-slider
        v-model="bias"
        class="mt-10 align-center"
        label="Bias"
        :persistent-hint="true"
        hint="Bias allows to shift the activation function by adding a constant to the input"
        step="0.001"
        min="0.001"
        max="10"
        thumb-label="always"
      >
        <template #append>
          <v-text-field
            v-model="bias"
            style="margin-top: -45px"
            type="number"
            step="0.001"
            min="0.001"
            max="10"
          ></v-text-field>
        </template>
      </v-slider>
      <v-text-field
        v-model="trainingCycles"
        :persistent-hint="true"
        hint="Number of training cycles to be performed"
        label="Training cycles"
        type="number"
      ></v-text-field>
      <div class="mt-4">
        <v-btn
          :disabled="!valid"
          :loading="training"
          class="mr-4 primary"
          @click="train"
        >
          Train
        </v-btn>
        <v-btn @click="resetToRecommendedValues">
          Reset to recommended values
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import NeuralNetwork from '~/lib/nn/neural-network.js'
import { trainingData } from '~/lib/nn/colors.js'

export default {
  data: () => ({
    valid: true,
    inputNodes: 3,
    inputNodesHint: '',
    hiddenNodes: 24,
    outputNodes: 12,
    outputNodesHint:
      "Predefined value that cannot be changed, 12 colors are supported: ['Black','Blue','Brown','Cyan','Green','Grey','Orange','Pink','Purple','Red','White','Yellow']",
    learningRate: 0.01,
    bias: 1,
    trainingCycles: 50000,
    normalizer: 255,
    training: false,
    neuralNetwork: '',
  }),
  methods: {
    train() {
      this.training = true
      setTimeout(() => {
        this.neuralNetwork = new NeuralNetwork(
          this.inputNodes,
          this.hiddenNodes,
          this.outputNodes,
          this.learningRate,
          this.bias,
          this.trainingCycles,
          this.normalizer
        )
        this.neuralNetwork.train(trainingData)
        this.training = false
        this.$emit('trained', this.neuralNetwork)
      }, 200)
    },
    resetToRecommendedValues() {
      this.hiddenNodes = 12
      this.learningRate = 0.01
      this.trainingCycles = 50000
      this.bias = 1
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
</style>
