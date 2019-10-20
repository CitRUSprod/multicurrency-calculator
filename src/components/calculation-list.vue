<template lang="pug">
    
    .calculation-list
        .inner
            .pb-4
                v-card(
                    color="primary"
                    height="100%"
                )
                    v-card-text.fill-height
                        v-sheet.scrollable(height="100%")
                            v-card-text
                                v-card(
                                    v-for="wallet, index in wallets"
                                    :key="index"
                                    :class="{ 'mb-2': index + 1 !== wallets.length }"
                                    color="success"
                                )
                                    v-card-text
                                        b {{ wallet.number }} {{ wallet.currency.text }}
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
                            v-col.pr-1(cols="8")
                                v-text-field.title(
                                    v-model="sum"
                                    hide-details
                                    readonly
                                    solo
                                )
                            v-col(cols="4")
                                app-search-menu(
                                    label="Currency"
                                    :items="currencies"
                                    v-model="currency"
                                )

</template>


<script>

    import AppSearchMenu from "@/components/search-menu.vue"

    export default {
        components: {
            AppSearchMenu
        },
        data() {
            return {
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
                return 0
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
