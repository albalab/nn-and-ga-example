<template>
  <div>
    <h2 class="mb-4">
      Prediction:
      <span :class="predictionColor"> {{ prediction }}</span>
    </h2>
    <v-simple-table>
      <template #default>
        <thead>
          <tr>
            <th class="text-center">Color</th>
            <th class="text-center">Prediction rate</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in predictionTable" :key="p.color">
            <td :class="`${p.color.toLowerCase()}--text`">{{ p.color }}</td>
            <td>{{ p.rate }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  props: {
    prediction: {
      type: String,
      required: true,
    },
    predictionTable: {
      type: Array,
      required: true,
    },
  },
  computed: {
    predictionColor() {
      return this.prediction
        ? `${this.prediction.toLowerCase()}--text`
        : `white--text`
    },
  },
}
</script>
