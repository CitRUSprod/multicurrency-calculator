import Vue from "vue"
import Vuex from "vuex"

import settings from "./modules/settings"
import currencies from "./modules/currencies"
import cp from "./modules/control-panel"


Vue.use(Vuex)


export default new Vuex.Store({
    plugins: [vp.default.plugin],
    modules: { settings, currencies, cp }
})
