import currencies from "@/currencies"


const state = {
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


export default {
    namespaced: true,
    state
}
