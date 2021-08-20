<template>
  <main v-if="render" class="admin">
    <component :is="component" :data="modalData" />

    <template v-if="!loggedIn">
      <v-row justify="center" align="center" style="height: 100%; margin: 0">
        <v-col md="4" sm="12">
          <v-card-text>
            <h1>Giriş yap</h1>
            <br />

            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="email"
                label="Email*"
                type="email"
                :rules="[(v) => !!v || 'Email gerekli']"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Şifreniz*"
                type="password"
                :rules="[(v) => !!v || 'Şifreniz gerekli']"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              style="color: var(--tekel-blue)"
              text
              :disabled="!valid"
              @click="login(email, password)"
            >
              Giriş
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <div class="box aside">
        <h2>Grup</h2>
        <ul>
          <li>
            <nuxt-link to="/admin/kategoriler">Kategoriler</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/admin/urunler">Ürünler</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/admin/diger">Diğer</nuxt-link>
          </li>
        </ul>
      </div>
      <div class="box inside">
        <Nuxt />
      </div>
    </template>
  </main>
</template>

<script>
export default {
  data() {
    return {
      loggedIn: false,
      user: null,
      valid: true,
      email: '',
      password: '',
      component: null,
      modalData: {},
      render: false,
    }
  },
  mounted() {
    let user = localStorage.getItem('user')
    if (user) {
      try {
        user = JSON.parse(user)
        this.user = user
        if (this.user.uid != null) {
          this.loggedIn = true
        }
      } catch (e) {
        return e
      }
    }
    this.render = true

    if (this.loggedIn && this.$route.path === '/admin') {
      this.$router.push('/admin/kategoriler')
    }
  },
  methods: {
    async login(email, password) {
      this.loading = true
      this.valid = this.$refs.form.validate()

      if (this.valid) {
        try {
          await this.$fire.auth
            .signInWithEmailAndPassword(email, password)
            .then((res) => {
              this.user = {
                photoURL: res.user.photoURL,
                email: res.user.email,
                displayName: res.user.displayName,
                uid: res.user.uid,
              }
              localStorage.setItem('user', JSON.stringify(this.user))
              this.loading = false
              this.loggedIn = true
            })
        } catch (error) {
          this.loading = false

          this.modalData.type = 'error'
          this.modalData.message = error.message
          this.component = 'order-completed'
        }
      }

      this.loading = false
    },
  },
}
</script>

<style lang="scss" scoped>
main.admin {
  grid-template-columns: 200px 1fr;
  .box {
    h2 {
      border-bottom: 1px solid var(--border-color);
      width: 100%;
    }
  }
  .box.aside {
    ul {
      li {
        padding: 1rem;
        a {
          color: #222;
        }
        .nuxt-link-active {
          color: var(--tekel-blue);
          font-weight: 600;
        }
      }
    }
  }
}
</style>