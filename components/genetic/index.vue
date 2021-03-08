<template>
  <v-container max-width="600px" style="gap: 10px">
    <Settings @generation-populated="ga = $event" />
    <Visualization :ga="ga" />
  </v-container>
</template>

<script>
import Settings from '~/components/genetic/Settings.vue'
import Visualization from '~/components/genetic/Visualization.vue'
export default {
  components: {
    Settings,
    Visualization,
  },
  data() {
    return {
      ga: {},
    }
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
