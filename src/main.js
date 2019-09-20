import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { JSEncrypt } from 'jsencrypt' // RSA加密插件
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import vFilters from './utils/filter'

Vue.use(ElementUI)
Vue.use(preview)

for (const key in vFilters) {
  Vue.filter(key, vFilters[key])
}

Vue.prototype.$getCode = password => {
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey('MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCfvVSl7UOWWF9tNCQS5aN68vSoTaa5aerzRdt+DOT7UaAL4VUE/nsmbJgIgI8pMhpR5ZqY9Ygm9Bfr5ei6ckirIxZWw3RcNkiJ65KqaHPQJaE+WVCT/KhBPldw+loxliwEmnWSB11YlFG6ALHHaYF2HdhRacvl/JjttoT8eMpQZwIDAQAB')
  const data = encrypt.encrypt(password)
  return data
}

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
