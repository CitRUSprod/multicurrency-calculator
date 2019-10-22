import Decimal from "decimal.js-light"


class Converter {

    constructor({ amount, currency = "USD" }, rates) {
        this._rates = rates
        this._amount = new Decimal(amount).div(rates[currency]).toNumber()

        const proxy = new Proxy(this, {
            get(target, prop) {
                if (prop[0] !== "_") {
                    if (target._rates[prop]) {
                        return new Decimal(target._amount).mul(target._rates[prop]).toNumber()
                    } else {
                        return 0
                    }
                }
            }
        })

        return proxy
    }

}


export default Converter
