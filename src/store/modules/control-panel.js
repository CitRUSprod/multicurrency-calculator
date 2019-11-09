const state = {
    mode: "wallet-adding",
    sign: true,
    amount: "0",
    currency: null,
    note: "",
    operationAmount: "0",
    operationSign: "+%",
    saved: false
}


const mutations = vp.make.mutations(state)


export default {
    namespaced: true,
    state,
    mutations
}
