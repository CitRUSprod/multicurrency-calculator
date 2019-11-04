<template lang="pug">
    
    .calculation-list
        v-dialog(
            max-width="300"
            v-model="resultSettings.dialog"
            persistent
        )
            v-card
                v-card-title.headline.primary.white--text Result settings
                v-card-text
                    v-row
                        v-col(cols="12")
                            app-search-menu(
                                label="Currency"
                                :items="currencies"
                                v-model="resultSettings.currency"
                            )
                    v-row
                        v-col(cols="12")
                            v-text-field.title(
                                label="Precision"
                                v-model.number="resultSettings.precision"
                                hide-details
                            )
                v-card-actions
                    v-spacer
                    v-btn(
                        color="success"
                        @click="saveResultSettings"
                        text
                    ) Save
                    v-btn(
                        color="error"
                        @click="cancelResultSettings"
                        text
                    ) Cancel
        .inner
            .pb-4
                v-card(
                    color="primary"
                    height="100%"
                )
                    v-card-text.fill-height
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
                                                .subtitle-1.font-weight-bold {{ wallet.amount }} {{ wallet.currency.text }}
                                                .caption.font-italic(v-if="!!wallet.note") {{ wallet.note }}
                                            .control.pl-2
                                                div
                                                    v-icon.mr-2(
                                                        :disabled="editingMode"
                                                        @click="editWallet(index)"
                                                        small
                                                    ) fas fa-pen
                                                    v-icon(
                                                        :disabled="editingMode"
                                                        @click="removeWallet(index)"
                                                        small
                                                    ) fas fa-trash
            div
                v-card(
                    color="primary"
                    height="100%"
                )
                    v-card-text
                        v-text-field.title(
                            append-icon="fas fa-cog"
                            :prefix="currency ? `${currency.text} ` : void 0"
                            v-model="sum"
                            @click:append="resultSettings.dialog = true"
                            hide-details
                            readonly
                            solo
                        )
                        app-search-menu(
                            :items="currencies"
                            v-model="currency"
                            style="display:none"
                        )

</template>


<script>

    import Decimal from "decimal.js-light"

    import Converter from "@/libs/converter"
    import AppSearchMenu from "@/components/search-menu.vue"


    export default {
        components: {
            AppSearchMenu
        },
        data() {
            return {
                resultSettings: {
                    dialog: false,
                    precision: 4,
                    currency: null
                }
            }
        },
        computed: {
            ...vp.sync("settings", ["precision", "currency"]),
            ...vp.get("currencies", {
                currencies: "list",
                rates: "rates"
            }),
            ...vp.sync("currencies", ["wallets"]),
            ...vp.sync("editing", {
                editingMode: "mode",
                editingParams: "params"
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
            precision(v) {
                this.resultSettings.precision = v
            },
            currency(v) {
                this.resultSettings.currency = v
            },
            editingMode(v) {
                if (!v && _.isNumber(this.editingParams.index)) {
                    const { index, sign, amount, currency, note } = _.cloneDeep(this.editingParams)
                    const wallet = { sign, amount, currency, note }
                    if (!_.isEqual(this.wallets[index], wallet)) {
                        const wallets = _.cloneDeep(this.wallets)
                        wallets[index] = wallet
                        this.wallets = wallets
                        this.editingParams = {
                            index: null,
                            sign: null,
                            amount: null,
                            currency: null,
                            note: null
                        }
                    }
                }
            }
        },
        methods: {
            saveResultSettings() {
                this.precision = this.resultSettings.precision
                this.currency = this.resultSettings.currency
                this.resultSettings.dialog = false
            },
            cancelResultSettings() {
                this.resultSettings.precision = this.precision
                this.resultSettings.currency = this.currency
                this.resultSettings.dialog = false
            },
            editWallet(index) {
                const wallet = _.cloneDeep(this.wallets[index])
                wallet.index = index
                this.editingParams = wallet
                this.editingMode = true
            },
            removeWallet(index) {
                this.wallets.splice(index, 1)
            },
            walletColor(index, sign) {
                if (this.editingMode && index !== this.editingParams.index) {
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
            display: grid
            grid-template-columns: 1fr
            grid-template-rows: minmax(0, 1fr) auto
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
