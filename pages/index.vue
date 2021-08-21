<template>
  <main @scroll="fixBug">
    <component
      :is="component"
      :data="modalData"
      @close="component = null"
      @alert="
        modalData = $event
        component = 'order-completed'
        modalData.type === 'success' ? removeLocalstorageBasket() : ''
      "
    />

    <!-- <div class="box search-bar"></div> -->
    <div v-if="renderCategories" class="box categories">
      <h2>Kategoriler</h2>
      <template v-if="categoryLoading">
        <v-skeleton-loader
          v-for="n in 10"
          :key="n"
          height="50px"
          cols="12"
          style="margin: 0 !important"
          type="list-item"
        ></v-skeleton-loader>
      </template>
      <ul v-else>
        <li
          v-for="category in categories"
          :key="category.id"
          @click="selectedCategory = category"
        >
          <div
            :class="{
              selected: selectedCategory && selectedCategory.id === category.id,
            }"
          >
            <span>{{ category.name | limit(14) }}</span>
            <icn-right-arrow />
          </div>
        </li>
      </ul>
    </div>
    <div class="box products">
      <h2>Ürünler</h2>
      <template v-if="productLoading">
        <ul>
          <li v-for="n in 12" :key="n">
            <v-skeleton-loader
              cols="4"
              max-width="200px"
              type="image"
            ></v-skeleton-loader>
          </li>
        </ul>
      </template>
      <ul v-else>
        <li v-for="product in productsAsCategory" :key="product.id">
          <div class="thumbnail">
            <template v-if="product.thumbnail">
              <v-img
                contain
                aspect-ratio="1.5"
                :src="product.thumbnail"
                max-width="200px"
              />
            </template>
            <template v-else>
              <v-img
                cover
                aspect-ratio="1.5"
                src="/images/default.jpg"
                max-width="200px"
              />
            </template>
          </div>
          <h3>{{ product.name }}</h3>
          <div class="price">{{ product.price }}₺</div>

          <div class="quantity-buttons">
            <div @click="addBasket(product, 1)"><icn-plus /></div>
            <template
              v-if="basket.find((item) => item.product.id === product.id)"
            >
              <div class="quantity">
                {{
                  basket.find((item) => item.product.id === product.id)
                    ? basket.find((item) => item.product.id === product.id)
                        .quantity
                    : 0
                }}
              </div>
              <div @click="addBasket(product, -1)"><icn-minus /></div>
            </template>
          </div>
        </li>
      </ul>
    </div>
    <div class="box basket">
      <h2>
        Sepetim
        <small v-if="transportFee">+{{ transportFee }}₺ Getirme ücreti</small>
      </h2>
      <span v-if="basket.length === 0">Sepetiniz boş</span>
      <ul>
        <li v-for="item in basket" :key="item.id">
          <div class="quantity-buttons">
            <div @click="addBasket(item.product, -1)"><icn-minus /></div>
            <div class="quantity">{{ item.quantity }}</div>
            <div @click="addBasket(item.product, 1)"><icn-plus /></div>
          </div>
          <div class="group">
            <div class="name">{{ item.product.name | limit(19) }}</div>
            <div class="price">
              {{ (item.product.price * item.quantity) | money }}
            </div>
          </div>
        </li>
        <li
          v-if="basket.length"
          class="order-btn"
          @click="
            component = 'order-details'
            modalData = {
              total: $options.filters.money(totalBasket + transportFee),
            }
          "
        >
          <div>
            <span class="text">Siparişi Tamamla</span>
            <span class="total">{{
              (totalBasket + transportFee) | money
            }}</span>
          </div>
        </li>
        <li @click="clearBasket()">
          <div class="clear-btn">
            <icn-trash />
            <span>Sepeti temizle</span>
          </div>
        </li>
      </ul>
    </div>

    <footer>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </footer>
  </main>
</template>

<script>
export default {
  filters: {
    money(value) {
      return Number(value.toFixed(1)).toLocaleString() + '₺'
    },
    limit(text, limit) {
      return text.length > limit ? text.slice(0, limit) + '...' : text
    },
  },
  scrollToTop: true,
  data() {
    return {
      categoryLoading: true,
      productLoading: true,
      component: false,
      modalData: {},
      transportFee: null,
      selectedCategory: {
        id: -1,
        name: 'Tümü',
      },
      categories: [
        {
          id: -1,
          name: 'Tümü',
        },
      ],
      products: [],
      basket: [
        // {
        //   id: 1,
        //   product: {
        //     id: 1,
        //     name: 'Efes 40cl',
        //     thumbnail: 'bira.jpg',
        //     price: 19.99,
        //     category: 1,
        //   },
        //   quantity: 2,
        // },
      ],
      attrs: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2,
      },
      opacity: 1,
      renderCategories: true,
    }
  },
  computed: {
    productsAsCategory() {
      if (this.selectedCategory.id === -1) {
        return this.products
      } else {
        return this.products.filter(
          (product) => product.category === this.selectedCategory.id
        )
      }
    },
    totalBasket() {
      const total = this.basket.reduce((a, b) => {
        a += b.quantity * b.product.price

        return a
      }, 0)

      return total
    },
  },

  async mounted() {
    let basket = localStorage.getItem('basket')
    if (basket) {
      try {
        basket = JSON.parse(basket)
        this.basket = basket
      } catch {}
    }
    const basketCount = this.basket.reduce((a, b) => {
      a += b.quantity
      return a
    }, 0)
    this.$store.commit('add-basket', basketCount)

    await this.$fire.database.ref('others/0').once('value', (snapshot) => {
      // 0 : { title, value }
      this.transportFee = Number(snapshot.val().value)
    })

    this.categoryLoading = true
    await this.$fire.database.ref('categories').once('value', (snapshot) => {
      const data = snapshot.val()

      if (data != null) {
        Object.values(data).forEach((v) => {
          const category = {
            id: Number(v.id),
            name: v.name,
          }

          this.categories.push(category)
        })
      }
      this.categoryLoading = false
    })
    this.productLoading = true
    await this.$fire.database.ref('products').once('value', (snapshot) => {
      const data = snapshot.val()

      if (data != null) {
        Object.values(data).forEach((v) => {
          const product = {
            id: Number(v.id),
            name: v.name,
            thumbnail: v.thumbnail || '',
            category: Number(v.category),
            price: Number(v.price),
          }

          this.products.push(product)
        })
      }
      this.productLoading = false
    })
  },
  methods: {
    addBasket(product, quantity) {
      let existing = false
      const id = Date.now()
      const obj = {
        id,
        product,
        quantity,
      }
      this.basket.forEach((item, i) => {
        if (item.product.id === product.id) {
          existing = true // existing product
          this.basket[i].quantity += quantity
          if (this.basket[i].quantity < 0) {
            this.basket[i].quantity = 0
          }

          if (this.basket[i].quantity === 0) {
            // delete
            this.basket.splice(i, 1)
          }
        }
      })

      if (!existing && quantity !== -1) {
        this.basket.push(obj)
      }

      localStorage.setItem('basket', JSON.stringify(this.basket))

      const basketCount = this.basket.reduce((a, b) => {
        a += b.quantity
        return a
      }, 0)
      this.$store.commit('add-basket', basketCount)
    },
    clearBasket() {
      this.basket = []
      this.removeLocalstorageBasket()
      this.$store.commit('add-basket', 0)
    },
    removeLocalstorageBasket() {
      localStorage.removeItem('basket')
    },
    fixBug(e) {
      if (document.body.clientWidth <= 680) {
        clearInterval(this.iterval)
        document.querySelector('.box.categories').style.opacity = 0
        this.iterval = setInterval(() => {
          document.querySelector('.box.categories').style.opacity = 1
        }, 1000)
      }
    },
  },
}
</script>

<style scoped lang="scss">
main {
  .search-bar {
    grid-column: 1 / -1;
    height: 50px;
  }
  .categories {
    ul {
      li {
        div {
          font-weight: 300;
          padding: 0.5rem;
          background-color: #fff;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          &:hover {
            background-color: rgb(231, 230, 230);
          }
          &.selected {
            color: white;
            background-color: var(--tekel-blue);
            svg {
              display: block;
            }
          }
          svg {
            fill: white;
            display: none;
            width: 12px;
            height: 12px;
          }
        }
      }
    }
  }
  .products {
    ul {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 200px));
      grid-template-rows: min-content;
      padding: 1rem !important;
      // gap: 1rem;
      li {
        position: relative;
        background-color: #fff;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        .thumbnail {
          display: flex;
          padding: 4px;
          justify-content: center;
        }
        h3 {
          padding: 4px;
          font-size: 1em;
          font-weight: 300;
          text-align: center;
        }
        .price {
          text-align: center;
          padding: 4px 0;
          font-weight: 600;
          color: var(--tekel-blue);
        }
      }
    }
  }
  .basket {
    h2 {
      display: flex;
      flex: 1;
      justify-content: space-between;
      align-items: center;
      small {
        font-size: 0.9em;
        color: var(--tekel-blue);
      }
    }
    > span {
      padding: 1rem 1rem 0 1rem;
      display: block;
      font-weight: 300;
      opacity: 0.5;
    }
    ul {
      li {
        padding: 1rem;
        position: relative;
        border-bottom: 1px solid var(--border-color);
        .quantity-buttons {
          top: auto;
          display: flex;
          align-items: center;
          .quantity {
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }

        .group {
          margin-right: 4px;
          font-size: 0.9em;
          .name {
            font-weight: 500;
          }
          .price {
            color: var(--tekel-blue);
          }
        }
      }
      li.order-btn {
        border-bottom: unset;
        font-weight: 300;
        div {
          border-radius: 4px;
          background-color: white;
          display: flex;
          justify-content: center;
          cursor: pointer;
          span {
            padding: 10px 6px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1em;
            font-weight: 300;
          }
          .text {
            background-color: var(--tekel-blue);
            color: white;
            border-bottom-left-radius: 10px;
            border-top-left-radius: 10px;
            min-width: 100px;
          }
          .total {
            min-width: 70px;
            border-bottom-right-radius: 10px;
            border-top-right-radius: 10px;
            border: 1px solid var(--tekel-blue);
            color: var(--tekel-blue);
          }
        }
      }
      li .clear-btn {
        cursor: pointer;
        font-weight: 600;
        color: var(--tekel-blue);
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        svg {
          width: 15px;
          height: 15px;
          margin-right: 6px;
          fill: var(--tekel-blue);
        }
      }
    }
  }

  .quantity-buttons {
    position: absolute;
    top: 4px;
    right: 4px;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.08);
    > div:not(.quantity) {
      background-color: white;
      cursor: pointer;
      width: 35px;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      svg {
        width: 10px;
        height: 10px;
        fill: var(--tekel-blue);
      }
    }
    .quantity {
      font-size: 16px;
      width: 35px;
      padding: 4px 0;
      text-align: center;
      background-color: var(--tekel-blue);
      color: white;
    }
  }
}
</style>
