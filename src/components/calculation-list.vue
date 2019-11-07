<template lang="pug">
    
    .calculation-list
        .inner
            v-card(
                color="primary"
                height="100%"
            )
                v-card-text.grid
                    v-card.scrollable(height="100%")
                        v-card-text.fill-height
                            .fill-height.d-flex.justify-center.align-center(v-if="!wallets.length")
                                .body-1.font-italic Wallet list is empty
                            v-card(
                                v-else
                                v-for="wallet, index in wallets"
                                :key="index"
                                :class="index + 1 === wallets.length ? 'mb-4' : 'mb-2'"
                                :color="walletColor(index, wallet.sign)"
                            )
                                v-card-text
                                    .wallet
                                        .information
                                            .subtitle-1.font-weight-bold {{ amountToString(wallet.amount) }} {{ wallet.currency.text }}
                                            .caption.font-italic(v-if="!!wallet.note") {{ wallet.note }}
                                        .control.pl-2
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
                editableWallet: -1
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
                cpSaved: "saved"
            }),
            sum() {
                if (this.currency) {
                    let sum = new Decimal(0)

                    for (const wallet of this.wallets) {
                        const converter = new Converter({
                            amount: wallet.amount,
                            currency: wallet.currency.text
                        }, this.rates)
                        const amount = converter[this.currency.text]
                        if (wallet.sign) {
                            sum = sum.add(amount)
                        } else {
                            sum = sum.sub(amount)
                        }
                    }

                    return _.round(sum.toNumber(), this.precision)
                } else {
                    return 0
                }
            }
        },
        watch: {
            cpMode(val, oldVal) {
                if (oldVal === "wallet-editing" && val === "wallet-adding" && this.cpSaved) {
                    this.cpSaved = false
                    const wallet = {
                        sign: this.cpSign,
                        amount: +this.cpAmount.replace(",", "."),
                        currency: this.cpCurrency,
                        note: this.cpNote
                    }
                    if (!_.isEqual(this.wallets[this.editableWallet], wallet)) {
                        const wallets = _.cloneDeep(this.wallets)
                        wallets[this.editableWallet] = wallet
                        this.wallets = wallets
                    }
                }
            }
        },
        methods: {
            amountToString(amount) {
                return amount.toString().replace(".", ",")
            },
            editWallet(index) {
                const wallet = _.cloneDeep(this.wallets[index])
                this.editableWallet = index
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
                if (this.cpMode === "wallet-editing" && index !== this.editableWallet) {
                    return sign ? "grey" : "grey darken-1"
                } else {
                    return sign ? "success" : "error"
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
                    word-break: break-word

                > .control
                    display: flex
                    align-items: center
                    white-space: nowrap

</style>
