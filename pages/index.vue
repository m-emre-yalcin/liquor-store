<template>
  <main>
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
    <div class="box categories">
      <h2>Kategoriler</h2>
      <ul>
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
            <span>{{ category.name }}</span>
            <icn-right-arrow />
          </div>
        </li>
      </ul>
    </div>
    <div class="box products">
      <h2>Ürünler</h2>
      <ul>
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
        Sepetim <small>+{{ transportFee }}₺ Getirme ücreti</small>
      </h2>
      <span v-if="basket.length === 0">Sepetiniz boş</span>
      <ul>
        <li v-for="item in basket" :key="item.id">
          <div class="quantity-buttons">
            <div @click="addBasket(item.product, 1)"><icn-plus /></div>
            <div class="quantity">{{ item.quantity }}</div>
            <div @click="addBasket(item.product, -1)"><icn-minus /></div>
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
  data() {
    return {
      component: false,
      modalData: {},
      transportFee: 5,
      selectedCategory: {
        id: -1,
        name: 'Tümü',
      },
      categories: [
        {
          id: -1,
          name: 'Tümü',
        },
        {
          id: 1,
          name: 'Bira',
        },
        {
          id: 2,
          name: 'Şarap',
        },
        {
          id: 3,
          name: 'Viski',
        },
        {
          id: 4,
          name: 'Atıştırmalık',
        },
      ],
      products: [
        {
          id: 1,
          name: 'Efes 40cl',
          thumbnail: '/images/efes-pilsen.jpg',
          category: 1,
          price: 19.99,
        },
        {
          id: 2,
          name: 'Jack Daniels Viski',
          thumbnail: null,
          price: 238.5,
          category: 3,
        },
        {
          id: 4,
          name: 'Öküzgözü Şarap',
          thumbnail: '/images/sarap.jpg',
          price: 80.99,
          category: 2,
        },
        {
          id: 3,
          name: 'Doritos Cips',
          thumbnail: null,
          price: 6.9,
          category: 4,
        },
      ],
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
  mounted() {
    let basket = localStorage.getItem('basket')
    if (basket) {
      try {
        basket = JSON.parse(basket)
        this.basket = basket
      } catch {}
    }
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
    },
    removeLocalstorageBasket() {
      localStorage.removeItem('basket')
    },
  },
}
</script>

<style scoped lang="scss">
$border: #2121210e;
main {
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

    h2 {
      color: #212121;
      font-weight: bold;
      font-size: 14px;
      font-weight: 600;
      padding: 0.5rem;
      border-bottom: 1px solid $border;
    }
  }
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
          border-bottom: 1px solid $border;
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
        border: 1px solid $border;
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
        border-bottom: 1px solid $border;
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
      border: 1px solid $border;
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
