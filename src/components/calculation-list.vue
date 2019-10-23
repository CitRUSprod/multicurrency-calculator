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
                            v-text-field.title(
                                label="Precision"
                                v-model.number="resultSettings.precision"
                                hide-details
                            )
                        v-col(cols="12")
                            app-search-menu(
                                label="Currency"
                                :items="currencies"
                                v-model="resultSettings.currency"
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
                            v-card-text
                                v-card(
                                    v-for="wallet, index in wallets"
                                    :key="index"
                                    :class="{ 'mb-2': index + 1 !== wallets.length }"
                                    color="success"
                                )
                                    v-card-text
                                        b {{ wallet.amount }} {{ wallet.currency.text }}
                                        template(v-if="!!wallet.note")
                                            br
                                            span {{ wallet.note }}
            div
                v-card(
                    color="primary"
                    height="100%"
                )
                    v-card-text
                        v-text-field.title(
                            append-icon="settings"
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
            sum() {
                if (this.currency) {
                    let sum = new Decimal(0)

                    for (const wallet of this.wallets) {
                        const converter = new Converter({
                            amount: wallet.amount,
                            currency: wallet.currency.text
                        }, this.rates)
                        sum = sum.add(converter[this.currency.text])
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

</style>
