export const strict = false

export const state = () => ({
  basketCount: 0
})

export const mutations = {
  'add-basket'(state, data) {
    state.basketCount = data
  }
}