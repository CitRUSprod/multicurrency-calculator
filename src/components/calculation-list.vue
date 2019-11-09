<template lang="pug">
    
    .calculation-list
        .inner
            v-card(
                color="primary"
                height="100%"
            )
                v-card-text.grid
                    v-card.scrollable(
                        ref="wallet-list"
                        height="100%"
                    )
                        v-card-text.fill-height
                            .fill-height.d-flex.justify-center.align-center(v-if="!wallets.length")
                                .body-1.font-italic Wallet list is empty
                            v-card(
                                v-else
                                v-for="wallet, index in wallets"
                                :key="index"
                                :class="index + 1 === wallets.length ? 'mb-4' : 'mb-2'"
                                :color="walletColor(index, wallet.sign)"
                                dark
                            )
                                v-card-text.white--text
                                    .wallet
                                        .information
                                            .subtitle-1.font-weight-bold.d-flex
                                                span {{ amountToString(wallet.amount) }} {{ wallet.currency.text }}
                                                .d-inline-block.ml-2(v-if="wallet.operation")
                                                    v-sheet.d-flex.px-2(
                                                        :color="walletBadgeColor(index, wallet.sign)"
                                                    )
                                                        v-icon.mr-1(x-small) {{ getOperationIcon(wallet.operation.sign) }}
                                                        span.subtitle-1.font-weight-bold {{ amountToString(wallet.operation.amount) }}
                                                        v-icon(
                                                            v-if="wallet.operation.sign === '+%' || wallet.operation.sign === '-%'"
                                                            x-small
                                                        ) fas fa-percent
                                                        v-icon.ml-2(
                                                            @click="removeOperation(index)"
                                                            x-small
                                                        ) fas fa-window-close
                                            .caption.font-italic(v-if="!!wallet.note") {{ wallet.note }}
                                            v-divider.my-2
                                            div(v-if="!wallet.operation")
                                                v-btn.overline.font-weight-bold(
                                                    
                                                    :disabled="cpMode !== 'wallet-adding'"
                                                    @click="addOperation(index)"
                                                    x-small
                                                    text
                                                ) + Operation
                                            .caption.font-weight-bold(v-else) = {{ amountToString(applyOperationToWallet(wallet)) }} {{ wallet.currency.text }}
                                        .control.pl-4
                                            div
                                                v-icon.mr-2(
                                                    :disabled="cpMode !== 'wallet-adding'"
                                                    @click="editWallet(index)"
                                                    small
                                                ) fas fa-pen
                                                v-icon(
                                                    :disabled="cpMode !== 'wallet-adding'"
                                                    @click="removeWallet(index)"
                                                    small
                                                ) fas fa-trash
                    v-text-field.title(
                        :prefix="currency ? `${currency.text} ` : void 0"
                        :value="amountToString(sum)"
                        :disabled="cpMode !== 'wallet-adding'"
                        @click:append="cpMode = 'result-settings'"
                        append-icon="fas fa-cog"
                        hide-details
                        readonly
                        solo
                    )
                        

</template>


<script>

    import Decimal from "decimal.js-light"

    import Converter from "@/libs/converter"
    

    export default {
        data() {
            return {
                walletIndex: -1
            }
        },
        computed: {
            ...vp.get("settings", ["precision", "currency"]),
            ...vp.sync("currencies", ["wallets"]),
            ...vp.get("currencies", {
                rates: "rates"
            }),
            ...vp.sync("cp", {
                cpMode: "mode",
                cpAmount: "amount",
                cpSign: "sign",
                cpCurrency: "currency",
                cpNote: "note",
                cpOperationAmount: "operationAmount",
                cpOperationSign: "operationSign",
                cpSaved: "saved"
            }),
            sum() {
                if (this.currency) {
                    let sum = new Decimal(0)

                    for (const wallet of this.wallets) {
                        const converter = new Converter({
                            amount: this.applyOperationToWallet(wallet),
                            currency: wallet.currency.text
                        }, this.rates)
                        const amount = converter[this.currency.text]
                        if (wallet.sign) {
                            sum = sum.add(amount)
                        } else {
                            sum = sum.sub(amount)
                        }
                    }

                    return sum.toNumber()
                } else {
                    return 0
                }
            }
        },
        watch: {
            wallets(val, oldVal) {
                if (val.length > oldVal.length) {
                    this.$nextTick(() => {
                        const height = this.$refs["wallet-list"].$el.scrollHeight
                        this.$refs["wallet-list"].$el.scroll({
                            top: height,
                            behavior: "smooth"
                        })
                    })
                }
            },
            cpMode(val, oldVal) {
                if (oldVal === "wallet-editing" && val === "wallet-adding" && this.cpSaved) {
                    this.cpSaved = false
                    if (~this.walletIndex) {
                        const wallet = {
                            sign: this.cpSign,
                            amount: +this.cpAmount.replace(",", "."),
                            currency: this.cpCurrency,
                            note: this.cpNote,
                            operation: _.cloneDeep(this.wallets[this.walletIndex].operation)
                        }
                        if (!_.isEqual(this.wallets[this.walletIndex], wallet)) {
                            const wallets = _.cloneDeep(this.wallets)
                            wallets[this.walletIndex] = wallet
                            this.wallets = wallets
                        }
                        this.walletIndex = -1
                    }
                } else if (oldVal === "operation-adding" && val === "wallet-adding" && this.cpSaved) {
                    this.cpSaved = false
                    if (~this.walletIndex) {
                        const wallets = _.cloneDeep(this.wallets)
                        const operation = {
                            sign: this.cpOperationSign,
                            amount: +this.cpOperationAmount.replace(",", ".")
                        }
                        if (!_.isEqual(wallets[this.walletIndex].operation, operation)) {
                            wallets[this.walletIndex].operation = operation
                            this.wallets = wallets
                        }
                        this.walletIndex = -1
                    }
                } else if (val === "wallet-adding" && !this.cpSaved) {
                    if (~this.walletIndex) this.walletIndex = -1
                }
            }
        },
        methods: {
            amountToString(amount) {
                return _.round(amount, this.precision).toString().replace(".", ",")
            },
            editWallet(index) {
                const wallet = _.cloneDeep(this.wallets[index])
                this.walletIndex = index
                this.cpAmount = this.amountToString(wallet.amount)
                this.cpSign = wallet.sign
                this.cpCurrency = wallet.currency
                this.cpNote = wallet.note
                this.cpMode = "wallet-editing"
            },
            removeWallet(index) {
                this.wallets.splice(index, 1)
            },
            walletColor(index, sign) {
                if (~this.walletIndex && index !== this.walletIndex) {
                    return sign ? "grey" : "grey darken-1"
                } else {
                    return sign ? "success" : "error"
                }
            },
            walletBadgeColor(index, sign) {
                if (~this.walletIndex && index !== this.walletIndex) {
                    return sign ? "grey lighten-1" : "grey darken-2"
                } else {
                    return sign ? "green darken-2" : "red darken-1"
                }
            },
            addOperation(index) {
                this.walletIndex = index
                this.cpMode = "operation-adding"
            },
            removeOperation(index) {
                const wallets = _.cloneDeep(this.wallets)
                wallets[index].operation = null
                this.wallets = wallets
            },
            getOperationIcon(sign) {
                const icons = {
                    "+%": "plus",
                    "-%": "minus",
                    "*": "times",
                    "/": "divide"
                }
                return `fas fa-${icons[sign]}`
            },
            applyOperationToWallet(wallet) {
                if (wallet.operation) {
                    let amount = new Decimal(wallet.amount)
                    
                    switch (wallet.operation.sign) {
                        case "+%":
                            amount = amount.add(amount.div(100).mul(wallet.operation.amount))
                            break
                        case "-%":
                            amount = amount.sub(amount.div(100).mul(wallet.operation.amount))
                            break
                        case "*":
                            amount = amount.mul(wallet.operation.amount)
                            break
                        case "/":
                            amount = amount.div(wallet.operation.amount)
                            break
                    }

                    return amount.toNumber()
                } else {
                    return wallet.amount
                }
            }
        }
    }

</script>


<style lang="sass">

    .calculation-list
        position: relative
        height: 100%

        > .inner
            position: absolute
            width: 100%
            height: 100%

            .grid
                display: grid
                grid-template-columns: 1fr
                grid-template-rows: minmax(0, 1fr) auto
                grid-row-gap: 16px
                height: 100%

            .scrollable
                overflow-y: auto

                &::-webkit-scrollbar
                    display: none

            .wallet
                display: flex
                justify-content: space-between

                > .information
                    width: 100%
                    word-break: break-word

                > .control
                    display: flex
                    align-items: center
                    white-space: nowrap

</style>
