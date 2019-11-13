const state = {
    dark: false,
    precision: 4,
    currency: {
        text: "USD",
        value: "usd"
    }
}


const mutations = vp.make.mutations(state)


export default {
    namespaced: true,
    state,
    mutations
}
