<template lang="pug">

    v-app
        v-navigation-drawer.elevation-2(
            color="primary"
            mini-variant
            permanent
            app
        )
            v-list(dense)
                v-list-item(@click="dark = !dark")
                    v-list-item-icon
                        v-icon {{ dark ? "nights_stay" : "wb_sunny" }}
                    v-list-item-content
        v-content
            v-container.py-0.fill-height(fluid)
                v-row.fill-height
                    v-col.pr-2(cols="6")
                        app-wallet-editor
                    v-col.pl-2(cols="6")
                        app-calculation-list

</template>


<script>

    import AppWalletEditor from "@/components/wallet-editor.vue"
    import AppCalculationList from "@/components/calculation-list.vue"

    export default {
        components: {
            AppWalletEditor,
            AppCalculationList
        },
        computed: {
            ...vp.sync("currencies", ["rates"]),
            ...vp.sync("settings", ["dark"]),
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
                    const { dark } = res.result
                    if (!_.isNil(dark)) this.dark = dark
                } else {
                    console.error(res.error)
                }
            },
            async getRates() {
                const res = await msgRequest("get-rates")
                if (res.success) {
                    this.rates = res.result
                } else {
                    console.error(res.error)
                }
            }
        },
        async mounted() {
            await this.getSettings()
            await this.getRates()
        }
    }
    
</script>
