<template lang="pug">

    v-app
        v-dialog(
            max-width="300"
            v-model="ratesDialog"
            persistent
            scrollable
        )
            v-card
                v-card-title.headline.primary.white--text Rates
                v-card-text
                    v-list(subheader)
                        v-subheader Fiat
                        v-list-item(
                            v-for="curr, index in currencies[0].elements"
                            :key="index"
                            v-if="curr.value !== 'usd'"
                        )
                            v-list-item-content
                                v-list-item-title 1 USD = {{ rates[curr.text] }} {{ curr.text }}
                    v-list(subheader)
                        v-subheader Crypto
                        v-list-item(
                            v-for="curr, index in currencies[1].elements"
                            :key="index"
                        )
                            v-list-item-content
                                v-list-item-title 1 USD = {{ rates[curr.text] }} {{ curr.text }}
                v-divider
                v-card-actions
                    v-spacer
                    v-btn(
                        color="success"
                        :loading="gettingRates"
                        @click="getRates"
                        text
                    ) Update
                    v-btn(
                        color="error"
                        :loading="gettingRates"
                        @click="ratesDialog = false"
                        text
                    ) Close
        v-dialog(
            max-width="400"
            v-model="infoDialog"
            persistent
            scrollable
        )
            v-card
                v-card-title.headline.primary.white--text Info
                v-card-text
                    v-list(dense)
                        v-list-item.subtitle-1.px-0
                            b.mr-2 Name:
                            | Multicurrency Calculator
                        v-list-item.subtitle-1.px-0
                            b.mr-2 Version:
                            | 0.0.1
                        v-list-item.subtitle-1.px-0
                            b.mr-2 Developer:
                            | CitRUS
                        v-list-item.subtitle-1.px-0
                            b.mr-2 GitHub:
                            i
                                a(
                                    href="#"
                                    @click.prevent="openGithub"
                                ) LINK
                v-divider
                v-card-actions
                    v-spacer
                    v-btn(
                        color="error"
                        :loading="gettingRates"
                        @click="infoDialog = false"
                        text
                    ) Close
        v-navigation-drawer.elevation-2(
            color="primary"
            mini-variant
            permanent
            app
        )
            v-list(dense)
                app-list-item(
                    tooltip="Theme"
                    :icon="dark ? 'fas fa-moon' : 'fas fa-sun'"
                    :click="() => { dark = !dark }"
                )
                app-list-item(
                    tooltip="Rates"
                    icon="fas fa-search-dollar"
                    :click="() => { ratesDialog = true }"
                )
                app-list-item(
                    tooltip="Info"
                    icon="fas fa-info-circle"
                    :click="() => { infoDialog = true }"
                )
        v-content
            v-container.py-0.fill-height(fluid)
                v-row.fill-height
                    v-col.pr-2(cols="6")
                        app-control-panel
                    v-col.pl-2(cols="6")
                        app-calculation-list

</template>


<script>

    import { ipcRenderer } from "electron"

    import AppControlPanel from "@/components/control-panel.vue"
    import AppCalculationList from "@/components/calculation-list.vue"
    import AppListItem from "@/components/list-item.vue"


    export default {
        components: {
            AppControlPanel,
            AppCalculationList,
            AppListItem
        },
        data() {
            return {
                gettingRates: false,
                ratesDialog: false,
                infoDialog: false
            }
        },
        computed: {
            ...vp.sync("currencies", {
                currencies: "list",
                rates: "rates"
            }),
            ...vp.sync("settings", ["dark", "precision", "currency"]),
            settings: vp.get("settings")
        },
        watch: {
            dark(v) {
                this.$vuetify.theme.dark = v
            },
            settings: {
                deep: true,
                async handler(v) {
                    const res = await msgRequest("set-settings", 0, v)
                    if (!res.success) {
                        console.error(res.error)
                    }
                }
            }
        },
        methods: {
            async getSettings() {
                const res = await msgRequest("get-settings")
                if (res.success) {
                    const { dark, precision, currency } = res.result
                    if (!_.isNil(dark)) this.dark = dark
                    if (!_.isNil(precision)) this.precision = precision
                    if (!_.isNil(currency)) this.currency = currency
                } else {
                    console.error(res.error)
                }
            },
            async getRates() {
                this.gettingRates = true
                const res = await msgRequest("get-rates")
                if (res.success) {
                    this.rates = res.result
                } else {
                    console.error(res.error)
                }
                this.gettingRates = false
            },
            openGithub() {
                ipcRenderer.send("open-in-browser", "https://github.com/CitRUSprod/multicurrency-calculator")
            }
        },
        async mounted() {
            await this.getSettings()
            await this.getRates()
        }
    }
    
</script>
