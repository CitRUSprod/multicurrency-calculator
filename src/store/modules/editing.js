const state = {
    mode: false,
    params: {
        index: null,
        sign: null,
        amount: null,
        currency: null,
        note: null
    }
}


const mutations = vp.make.mutations(state)


export default {
    namespaced: true,
    state,
    mutations
}
