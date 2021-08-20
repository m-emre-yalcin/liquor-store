<template>
  <v-app>
    <header class="__top">
      <div class="__inner">
        <nuxt-link to="/" class="logo">
          <h1 style="white-space: nowrap">
            {{ logoTitle }}{{ $route.name.includes('admin') ? ' - Panel' : '' }}
          </h1>
        </nuxt-link>

        <div
          v-if="!$route.name.includes('admin')"
          class="basket-btn"
          @click="scrollBottom()"
        >
          <icn-basket />
        </div>
      </div>
    </header>

    <Nuxt />
  </v-app>
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
  methods: {
    scrollBottom() {
      document.querySelector('.__top + main').scrollTo({
        top: document.querySelector('.__top + main').scrollHeight,
        behavior: 'smooth',
      })
    },
  },
}
</script>


<style lang="scss">
$header-height: 80px;
.theme--light.v-application {
  background-color: unset;
}
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
      user-select: none;
      -webkit-user-select: none;
      display: flex;
      align-items: center;

      h1 {
        font-family: Arial, Helvetica, sans-serif;
        color: white;
      }
    }
    .basket-btn {
      display: none;
      cursor: pointer;
      padding: 10px;
      position: absolute;
      right: 0px;
      border-radius: 4px;
      border: 1px solid white;
      svg {
        width: 25px;
        height: 25px;
        fill: white;
      }
    }
  }
}
header + main {
  height: calc(100vh - #{$header-height});
  display: grid;
  grid-template-columns: 200px 1fr 260px;
  grid-template-rows: min-content;
  overflow: auto;
  gap: 1rem;
  padding: 1rem 20%;

  .box {
    border-radius: 4px;
    background-color: white;
    color: #141414;

    &:not(.products) {
      max-height: calc(100vh - 130px);
      overflow-y: auto;
      position: sticky;
      top: 0;
    }

    > h2 {
      color: #212121;
      font-weight: bold;
      font-size: 14px;
      font-weight: 600;
      padding: 0.5rem;
      border-bottom: 1px solid var(--border-color);
    }
  }
}
@media screen and (max-width: 1560px) {
  header.__top {
    .__inner {
      width: 80%;
    }
  }
  header + main {
    padding: 1rem 10%;
  }
}
@media screen and (max-width: 1160px) {
  header.__top {
    .__inner {
      width: 95%;
    }
  }
  header + main {
    padding: 1rem 2.5%;
  }
}
@media screen and (max-width: 978px) {
  header.__top {
    .__inner {
      width: calc(100% - 2rem);
      .basket-btn {
        display: flex;
      }
    }
  }
  header + main {
    padding: 1rem;
    grid-template-columns: 200px 1fr;
    .categories {
      overflow-y: unset !important;
    }
    .basket {
      z-index: 1;
      box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.05);
      grid-column: 1 / -1;
      position: static !important;
      overflow-y: unset !important;
    }
  }
  @media screen and (max-width: 680px) {
    header.__top {
      .__inner {
        .logo {
          font-size: 0.8em;
        }
      }
    }
    header + main {
      grid-template-columns: 160px 1fr;
      .categories {
        overflow-y: unset !important;
      }
      .products {
        ul {
          gap: 1rem;
        }
      }
      .basket {
        z-index: 1;
        box-shadow: 0 -5px 10px rgba(0, 0, 0, 0.05);
        grid-column: 1 / -1;
        position: static !important;
        overflow-y: unset !important;
      }
    }
    header.__top + main.admin {
      grid-template-columns: 1fr;
      grid-auto-flow: row;
      .aside {
        h2 {
          display: none;
        }
      }
    }
  }
}
</style>