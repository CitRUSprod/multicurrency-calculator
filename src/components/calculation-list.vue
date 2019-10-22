<template lang="pug">
    
    .calculation-list
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
                        v-row(no-gutters)
                            v-col(cols="12")
                                v-text-field.title(
                                    v-model="sum"
                                    hide-details
                                    readonly
                                    solo
                                )
                        v-row.mt-2(no-gutters)
                            v-col.pr-1(cols="6")
                                v-text-field.title(
                                    label="Precision"
                                    v-model.number="precision"
                                    hide-details
                                    solo
                                )
                            v-col.pl-1(cols="6")
                                app-search-menu(
                                    label="Currency"
                                    :items="currencies"
                                    v-model="currency"
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
                precision: 4,
                currency: null
            }
        },
        computed: {
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
