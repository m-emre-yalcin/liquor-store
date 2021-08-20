<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Siparişinizi bize gönderin!</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field
            v-model="name"
            label="İsminiz*"
            :rules="[(v) => !!v || 'İsminiz gerekli']"
            required
          ></v-text-field>
          <v-text-field
            v-model="phone"
            label="Telefonunuz*"
            :rules="[
              (v) => !!v || 'Siparişinizin son durumu için telefonunuz gerekli',
            ]"
            required
          ></v-text-field>

          <v-textarea
            v-model="address"
            required
            :rules="[(v) => !!v || 'Adresiniz gerekli']"
            label="Adresiniz*"
            hint="Sadece Ortaköy, Ulus, Levazım, Etiler, Beşiktaş bölgelerinden sipariş alabilmekteyiz."
          ></v-textarea>

          <v-text-field
            v-model="description"
            label="Sipariş açıklaması*"
          ></v-text-field>

          <div>Sipariş Tutarınız {{ data.total }}</div>
          <div>Ödeme yönteminizi seçin:</div>
          <v-radio-group v-model="paymentMethod" mandatory>
            <v-radio label="Kapıda Nakit" :value="'cash'"></v-radio>
            <v-radio label="Kapıda Kart" :value="'card'"></v-radio>
          </v-radio-group>

          <v-divider></v-divider>

          <v-container class="px-0" fluid>
            <v-checkbox
              v-model="saveInputs"
              label="Bilgilerimi daha sonra hatırla"
            ></v-checkbox>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="darken-1"
          text
          @click="
            dialog = false
            $emit('close')
          "
        >
          İptal
        </v-btn>
        <v-btn
          style="color: var(--tekel-blue)"
          text
          :disabled="!valid"
          @click="sendTheOrder()"
        >
          Tamamla
        </v-btn>
      </v-card-actions>
    </v-card>
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
      valid: true,
      dialog: true,
      name: '',
      phone: '',
      address: '',
      paymentMethod: 'cash',
      description: '',
      saveInputs: true,
    }
  },
  mounted() {
    let user = localStorage.getItem('costumer')
    if (user) {
      try {
        user = JSON.parse(user)

        this.name = user.name || ''
        this.phone = user.phone || ''
        this.address = user.address || ''
        this.paymentMethod = user.paymentMethod || ''
        this.description = user.description || ''
      } catch {}
    }
  },
  methods: {
    sendTheOrder() {
      this.valid = this.$refs.form.validate()

      if (this.valid) {
        // if form is valid
        const user = {
          name: this.name,
          phone: this.phone,
          address: this.address,
          paymentMethod: this.paymentMethod,
          description: this.description,
        }
        if (this.saveInputs) {
          localStorage.setItem('costumer', JSON.stringify(user))
        }

        this.$axios
          .post(
            'https://us-central1-tekelmailfunction.cloudfunctions.net/app',
            user
          )
          .then((res) => {
            this.$emit('alert', {
              type: 'success',
              message:
                'Siparişiniz başarıyla bize ulaştı! En kısa zamanda adresinize teslim edeceğiz.',
            })
          })
          .catch((err) => {
            this.$emit('alert', {
              type: 'error',
              message:
                'Siparişinizi alırken bir sorun ile karşılaştık. Lütfen daha sonra tekrar deneyiniz.',
            })

            throw err
          })

        this.dialog = false
      }
    },
  },
}
</script>
