<template>
  <v-dialog v-model="dialog" max-width="300px">
    <v-alert border="left" :type="data.type">{{ data.message }}</v-alert>
  </v-dialog>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      dialog: true,
    }
  },
}
</script>