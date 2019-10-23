<template lang="pug">

    v-card(
        color="primary"
        height="100%"
    )
        v-card-text
            div
                v-text-field.mb-3.display-1(
                    v-model="amount"
                    :append-icon="sign ? 'control_point' : 'remove_circle_outline'"
                    @click:append="sign = !sign"
                    hide-details
                    readonly
                    reverse
                    solo
                )
            div
                v-row(
                    v-for="btnRow, index in buttons"
                    :key="index"
                )
                    v-col(
                        v-for="btn, i in btnRow"
                        :key="i"
                        :cols="12 / btnRow.length"
                    )
                        v-btn.display-1(
                            color="secondary"
                            @click="btn.click"
                            large
                            block
                        )
                            component(:is="btn.icon ? 'v-icon' : 'span'") {{ btn.text }}
            .mt-3
                app-search-menu(
                    label="Currency"
                    :items="currencies"
                    v-model="currency"
                    solo
                )
            .mt-5
                v-text-field(
                    label="Note"
                    v-model.trim="note"
                    hide-details
                    solo
                )
        v-card-actions.px-4
            v-btn(
                color="success"
                @click="add"
                block
            ) Add

</template>


<script>

    import AppSearchMenu from "@/components/search-menu.vue"


    export default {
        components: {
            AppSearchMenu
        },
        data() {
            return {
                amountStr: "0",
                sign: true,
                note: "",
                currency: null,
                buttons: [
                    [
                        {
                            text: "1",
                            icon: false,
                            click: () => this.addSymbol("1")
                        },
                        {
                            text: "2",
                            icon: false,
                            click: () => this.addSymbol("2")
                        },
                        {
                            text: "3",
                            icon: false,
                            click: () => this.addSymbol("3")
                        }
                    ],
                    [
                        {
                            text: "4",
                            icon: false,
                            click: () => this.addSymbol("4")
                        },
                        {
                            text: "5",
                            icon: false,
                            click: () => this.addSymbol("5")
                        },
                        {
                            text: "6",
                            icon: false,
                            click: () => this.addSymbol("6")
                        }
                    ],
                    [
                        {
                            text: "7",
                            icon: false,
                            click: () => this.addSymbol("7")
                        },
                        {
                            text: "8",
                            icon: false,
                            click: () => this.addSymbol("8")
                        },
                        {
                            text: "9",
                            icon: false,
                            click: () => this.addSymbol("9")
                        }
                    ],
                    [
                        {
                            text: ",",
                            icon: false,
                            click: () => this.addSymbol(",")
                        },
                        {
                            text: "0",
                            icon: false,
                            click: () => this.addSymbol("0")
                        },
                        {
                            text: "backspace",
                            icon: true,
                            click: () => this.removeSymbol()
                        }
                    ]
                ]
            }
        },
        computed: {
            ...vp.get("currencies", {
                currencies: "list"
            }),
            ...vp.sync("currencies", ["wallets"]),
            amount: {
                get() {
                    return this.amountStr
                },
                set(v) {
                    if (!_.isString(v) || !v) {
                        this.amountStr = "0"
                    } else {
                        if (v.replace(/[^,]/g, "").length <= 1) {
                            if (v[0] === "0" && v.length > 1) {
                                const str = v.replace(/^0*/, "")
                                if (str.length) {
                                    if (str[0] === ",") {
                                        this.amountStr = `0${str}`
                                    } else {
                                        this.amountStr = str
                                    }
                                } else {
                                    this.amountStr = "0"
                                }
                            } else {
                                this.amountStr = v
                            }
                        }
                    }
                }
            }
        },
        methods: {
            addSymbol(symbol) {
                this.amount += symbol
            },
            removeSymbol() {
                this.amount = this.amount.substr(0, this.amount.length - 1)
            },
            add() {
                let amount = +this.amount.replace(",", ".")
                if (!this.sign) amount *= -1
                const wallet = {
                    amount,
                    currency: this.currency,
                    note: this.note
                }
                this.wallets.push(wallet)

                this.amount = 0
                this.note = ""
            }
        }
    }

</script>
