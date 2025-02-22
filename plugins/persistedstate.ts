import { createPersistedState } from 'pinia-plugin-persistedstate'
import type { Pinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    (nuxtApp.$pinia as Pinia).use(createPersistedState({
      storage: localStorage,
      key: prefix => `${prefix}`,
      auto: true
    }))
  }
})
