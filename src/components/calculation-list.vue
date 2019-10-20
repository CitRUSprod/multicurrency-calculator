<template lang="pug">
    
    .calculation-list
        .inner
            .pb-4
                v-card(
                    color="primary"
                    height="100%"
                )
                    v-card-text.fill-height
                        v-sheet.pa-4.scrollable(height="100%")
                            v-card(
                                v-for="term, index in terms"
                                :key="index"
                                :class="{ 'mb-2': index + 1 !== terms.length }"
                                color="success"
                            )
                                v-card-text
                                    b {{ term.number }} {{ term.currency.text }}
                                    br
                                    span {{ term.note }}
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
                currency: null,
                terms: [
                    {
                        number: 150,
                        currency: {
                            text: "USD",
                            value: "usd"
                        },
                        note: "Visa"
                    },
                    {
                        number: 39.95,
                        currency: {
                            text: "EUR",
                            value: "eur"
                        },
                        note: "MasterCard"
                    }
                ]
            }
        },
        computed: {
            ...vp.sync("currencies", {
                currencies: "list"
            }),
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
