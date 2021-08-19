<template>
  <div>
    <header class="__top">
      <div class="__inner">
        <div class="logo">
          <h1>{{ logoTitle }}</h1>
        </div>
      </div>
    </header>

    <Nuxt />
  </div>
</template>

<script>
import config from '@/nuxt.config'
export default {
  data() {
    return {
      logoTitle: config.head.title,
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      title: 'Vuetify.js',
    }
  },
}
</script>


<style scoped lang="scss">
$header-height: 80px;
header.__top {
  width: 100vw;
  height: $header-height;
  background-color: var(--tekel-blue);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  .__inner {
    display: flex;
    align-items: center;
    width: 60%;
    position: relative;
    .logo {
      display: flex;
      align-items: center;

      h1 {
        font-family: Arial, Helvetica, sans-serif;
        color: white;
      }
    }
  }
}
header + main {
  height: calc(100vh - #{$header-height});
}
</style>