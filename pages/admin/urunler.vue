<template>
  <v-data-table
    :headers="headers"
    :items="products"
    sort-by="calories"
    class="elevation-1"
    :loading="loading"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Ürünler</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template #activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Yeni Ürün
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.name"
                      label="İsim"
                      :rules="[(v) => !!v || 'Gerekli alan']"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="editedItem.price"
                      type="number"
                      label="Fiyat"
                      :rules="[(v) => !!v || 'Gerekli alan']"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-select
                      v-model="editedItem.category"
                      :items="categories"
                      label="Kategori"
                      :rules="[(v) => !!v || 'Gerekli alan']"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.thumbnail"
                      label="Görsel"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> İptal </v-btn>
              <v-btn
                color="blue darken-1"
                :disabled="!valid"
                text
                @click="save"
              >
                Kaydet
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Silmek istediğinize emin misiniz?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >İptal</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >Tamam</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
      <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template #no-data>
      <v-btn color="primary" @click="initialize"> Yeniden getir </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    loading: false,
    dialog: false,
    dialogDelete: false,
    valid: true,
    headers: [
      {
        text: 'İsim',
        value: 'name',
      },
      {
        text: 'Fiyat',
        value: 'price',
      },
      {
        text: 'Kategori',
        align: 'center',
        value: 'category',
      },
      {
        text: 'Görsel',
        value: 'thumbnail',
        sortable: false,
      },
      { text: 'İşlemler', align: 'center', value: 'actions', sortable: false },
    ],
    products: [
      // {
      //   id: 1,
      //   name: 'Efes 40cl',
      //   thumbnail: '/images/efes-pilsen.jpg',
      //   category: 1,
      //   price: 19.99,
      // },
      // {
      //   id: 2,
      //   name: 'Jack Daniels Viski',
      //   thumbnail: null,
      //   price: 238.5,
      //   category: 3,
      // },
      // {
      //   id: 4,
      //   name: 'Öküzgözü Şarap',
      //   thumbnail: '/images/sarap.jpg',
      //   price: 80.99,
      //   category: 2,
      // },
      // {
      //   id: 3,
      //   name: 'Doritos Cips',
      //   thumbnail: null,
      //   price: 6.9,
      //   category: 4,
      // },
    ],
    categories: [],
    editedIndex: -1,
    editedItem: {
      id: 0,
      name: '',
      thumbnail: '',
      category: '',
      price: '',
    },
    defaultItem: {
      id: 0,
      name: '',
      thumbnail: '',
      category: '',
      price: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Yeni Ürün' : 'Ürünü Düzene'
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    async initialize() {
      this.loading = true
      await this.$fire.database.ref('categories').once('value', (snapshot) => {
        const data = snapshot.val()

        if (data != null) {
          Object.values(data).forEach((v) => {
            const category = {
              value: Number(v.id),
              text: v.name,
            }

            if (Number(v.id) !== -1) {
              this.categories.push(category)
            }
          })
        }
        this.loading = false
      })

      await this.$fire.database.ref('products').once('value', (snapshot) => {
        const data = snapshot.val()

        if (data != null) {
          Object.values(data).forEach((v) => {
            const product = {
              id: v.id,
              name: v.name,
              thumbnail: v.thumbnail || '',
              category: Number(v.category),
              price: v.price,
            }

            this.products.push(product)
          })
        }
        this.loading = false
      })
    },

    editItem(item) {
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.products.splice(this.editedIndex, 1)
      this.loading = true
      this.$fire.database
        .ref('products')
        .set(this.products)
        .then(() => {
          this.loading = false
        })
      this.closeDelete()
    },

    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save() {
      this.valid = this.$refs.form.validate()

      if (this.valid) {
        if (this.editedIndex > -1) {
          Object.assign(this.products[this.editedIndex], this.editedItem)
        } else {
          this.editedItem.id = this.products.length ? Math.max(...this.products.map((c) => c.id)) + 1 : 1
          this.products.push(this.editedItem)
        }
        this.loading = true
        this.$fire.database
          .ref('products')
          .set(this.products)
          .then(() => {
            this.loading = false
          })
        this.close()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
</style>