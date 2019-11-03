<template lang="pug">

    v-card(
        color="primary"
        height="100%"
    )
        v-card-text
            div
                .headline {{ editingMode ? "Editing mode" : "Add mode" }}
            .mt-2.mb-4
                v-divider
            div
                v-text-field.mb-3.display-1(
                    v-model="amount"
                    :append-icon="sign ? 'fas fa-plus' : 'fas fa-minus'"
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
            .mt-4
                v-text-field(
                    label="Note"
                    v-model.trim="note"
                    hide-details
                    solo
                )
            .mt-4
                v-row(
                    v-if="editingMode"
                    no-gutters
                )
                    v-col.pr-2(cols="6")
                        v-btn(
                            color="success"
                            :disabled="!amountNum"
                            @click="editWallet"
                            block
                        ) Edit
                    v-col.pl-2(cols="6")
                        v-btn(
                            color="error"
                            @click="cancelEditWallet"
                            block
                        ) Cancel
                v-btn(
                    v-else
                    color="success"
                    :disabled="!amountNum"
                    @click="addWallet"
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
                            text: "fas fa-backspace",
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
            ...vp.sync("editing", {
                editingMode: "mode",
                editingParams: "params"
            }),
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
            },
            amountNum() {
                return +this.amount.replace(",", ".")
            }
        },
        watch: {
            editingMode(v) {
                if (v) {
                    const { sign, amount, currency, note } = this.editingParams
                    this.sign = sign
                    this.amount = amount.toString().replace(".", ",")
                    this.currency = currency
                    this.note = note
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
            setDefaultValues() {
                this.sign = true
                this.amount = 0
                this.note = ""
            },
            addWallet() {
                const wallet = {
                    sign: this.sign,
                    amount: this.amountNum,
                    currency: this.currency,
                    note: this.note
                }
                this.wallets.push(wallet)
                this.setDefaultValues()
            },
            editWallet() {
                const { index } = this.editingParams
                this.editingParams = {
                    index,
                    sign: this.sign,
                    amount: this.amountNum,
                    currency: this.currency,
                    note: this.note
                }
                this.editingMode = false
                this.setDefaultValues()
            },
            cancelEditWallet() {
                this.editingMode = false
                this.setDefaultValues()
            }
        }
    }

</script>
