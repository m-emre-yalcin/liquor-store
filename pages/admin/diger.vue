<template>
  <v-data-table
    :headers="headers"
    :items="others"
    sort-by="calories"
    class="elevation-1"
    :loading="loading"
  >
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Diğer</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <!-- <template #activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              Yeni kategori
            </v-btn>
          </template> -->
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.title"
                      label="Başlık"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editedItem.value"
                      label="Değer"
                      type="number"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close"> İptal </v-btn>
              <v-btn color="blue darken-1" text @click="save"> Kaydet </v-btn>
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
      <!-- <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon> -->
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
    headers: [
      {
        text: 'Başlık',
        value: 'title',
      },
      {
        text: 'Değer',
        value: 'value',
      },
      { text: 'İşlemler', value: 'actions', sortable: false },
    ],
    others: [],
    editedIndex: -1,
    editedItem: {
      text: '',
      value: 0,
    },
    defaultItem: {
      text: '',
      value: 0,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'Yeni' : 'Düzene'
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
    initialize() {
      this.loading = true
      this.$fire.database.ref('others').once('value', (snapshot) => {
        const data = snapshot.val()

        if (data != null) {
          Object.values(data).forEach((v) => {
            const item = {
              title: v.title,
              value: v.value,
            }

            this.others.push(item)
          })
        }
        this.loading = false
      })
    },

    editItem(item) {
      this.editedIndex = this.others.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedIndex = this.others.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.others.splice(this.editedIndex, 1)
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
      if (this.editedIndex > -1) {
        Object.assign(this.others[this.editedIndex], this.editedItem)
      } else {
        this.others.push(this.editedItem)
      }
      this.$fire.database.ref('others').set(this.others)
      this.close()
    },
  },
}
</script>

<style lang="scss" scoped>
</style>