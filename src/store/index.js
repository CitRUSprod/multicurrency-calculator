import Vue from "vue"
import Vuex from "vuex"

import settings from "./modules/settings"
import currencies from "./modules/currencies"
import editing from "./modules/editing"


Vue.use(Vuex)


export default new Vuex.Store({
    plugins: [vp.default.plugin],
    modules: { settings, currencies, editing }
})
