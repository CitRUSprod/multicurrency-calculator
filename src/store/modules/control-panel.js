const state = {
    mode: "wallet-adding",
    sign: true,
    amount: "0",
    currency: null,
    note: "",
    saved: false
}


const mutations = vp.make.mutations(state)


export default {
    namespaced: true,
    state,
    mutations
}
