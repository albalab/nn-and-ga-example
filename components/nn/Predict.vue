<template>
  <v-container max-width="600px" style="gap: 10px">
    <div>
      <h2 class="mb-4">Select color to be predicted</h2>
      <v-responsive
        :style="{ background: `rgb(${red}, ${green}, ${blue})` }"
        height="300px"
      ></v-responsive>

      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-slider v-model="red" :max="255" label="R" class="align-center">
              <template #append>
                <v-text-field v-model="red" type="number"></v-text-field>
              </template>
            </v-slider>
          </v-col>

          <v-col cols="12">
            <v-slider v-model="green" :max="255" label="G" class="align-center">
              <template #append>
                <v-text-field v-model="green" type="number"></v-text-field>
              </template>
            </v-slider>
          </v-col>

          <v-col cols="12">
            <v-slider v-model="blue" :max="255" label="B" class="align-center">
              <template #append>
                <v-text-field v-model="blue" type="number"></v-text-field>
              </template>
            </v-slider>
          </v-col>
        </v-row>
      </v-card-text>
      <v-btn class="primary" @click="predict()">Predict</v-btn>
      <v-btn class="ml-4" @click="$emit('go-back')">Back to training</v-btn>
    </div>
    <div>
      <PredictionTable
        :prediction-table="predictionTable"
        :prediction="prediction"
      />
    </div>
  </v-container>
</template>

<script>
import { mainColors } from '~/lib/nn/colors.js'
import PredictionTable from '~/components/nn/PredictionTable.vue'

export default {
  components: {
    PredictionTable,
  },
  props: {
    neuralNetwork: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      predictionTable: [],
      predictionColor: '',
      red: 64,
      green: 128,
      blue: 0,
      prediction: '',
    }
  },
  methods: {
    predict() {
      this.predictionTable = []
      let highestScore = 0
      let winner = ''
      const { output } = this.neuralNetwork.feedforward([
        this.red,
        this.green,
        this.blue,
      ])

      output.forEach((o, i) => {
        if (o[0] > highestScore) {
          highestScore = o[0]
          winner = mainColors[i]
        }
      })
      this.prediction = !winner ? 'No good prediction 😭' : winner
      mainColors.forEach((color, i) => {
        this.predictionTable.push({ color, rate: output[i][0] })
      })
    },
  },
}
</script>
