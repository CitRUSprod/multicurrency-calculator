import currencies from "@/currencies"


const stateForMutations = {
    wallets: [],
    rates: {}
}


const state = {
    ...stateForMutations,
    list: [
        {
            text: "Fiat",
            value: "fiat",
            group: true,
            elements: _.map(currencies.fiat, currency => ({
                text: currency,
                value: _.kebabCase(currency)
            }))
        },
        {
            text: "Crypto",
            value: "crypto",
            group: true,
            elements: _.map(currencies.crypto, currency => ({
                text: currency,
                value: _.kebabCase(currency)
            }))
        }
    ]
}


const mutations = vp.make.mutations(stateForMutations)


export default {
    namespaced: true,
    state,
    mutations
}
