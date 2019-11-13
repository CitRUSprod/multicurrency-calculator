<template lang="pug">
    
    v-card.d-flex.flex-column.justify-space-between(
        color="primary"
        height="100%"
    )
        v-card-text
            div
                .title MODE: {{ modeTitle }}
            .mt-2.mb-4
                v-divider
            template(v-if="cpMode === 'wallet-adding' || cpMode === 'wallet-editing'")
                .mb-3
                    v-text-field.display-1(
                        :value="amount"
                        :append-icon="cpSign ? 'fas fa-plus' : 'fas fa-minus'"
                        @click:append="cpSign = !cpSign"
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
                        v-model="cpCurrency"
                    )
                .mt-4
                    v-text-field(
                        label="Note"
                        v-model.trim="cpNote"
                        hide-details
                        solo
                    )
            template(v-else-if="cpMode === 'result-settings'")
                .mb-4
                    app-search-menu.title(
                        label="Currency"
                        :items="currencies"
                        v-model="resultCurrency"
                    )
                div
                    v-text-field.title(
                        :value="precisionValue"
                        append-icon="fas fa-minus"
                        prepend-inner-icon="fas fa-plus"
                        @click:append="subPrecision"
                        @click:prepend-inner="addPrecision"
                        hide-details
                        readonly
                        reverse
                        solo
                    )
            template(v-else-if="cpMode === 'operation-adding'")
                .mb-3
                    v-text-field.display-1(
                        :value="operationAmount"
                        :append-icon="operationIcon"
                        :prepend-inner-icon="cpOperationSign === '+%' || cpOperationSign === '-%' ? 'fas fa-percent' : void 0"
                        @click:append="changeOperationSign"
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
        v-card-actions.px-4.pb-4
            v-btn(
                v-if="cpMode === 'wallet-adding'"
                color="success"
                :disabled="!amountNum"
                @click="addWallet"
                block
            ) Add
            v-row(
                v-else-if="cpMode === 'wallet-editing'"
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
                        @click="cancel"
                        block
                    ) Cancel
            v-row(
                v-else-if="cpMode === 'result-settings'"
                no-gutters
            )
                v-col.pr-2(cols="6")
                    v-btn(
                        color="success"
                        @click="saveResultSettings"
                        block
                    ) Save
                v-col.pl-2(cols="6")
                    v-btn(
                        color="error"
                        @click="cancel"
                        block
                    ) Cancel
            v-row(
                v-else-if="cpMode === 'operation-adding'"
                no-gutters
            )
                v-col.pr-2(cols="6")
                    v-btn(
                        color="success"
                        :disabled="!operationAmountNum"
                        @click="addOperation"
                        block
                    ) Add
                v-col.pl-2(cols="6")
                    v-btn(
                        color="error"
                        @click="cancel"
                        block
                    ) Cancel

</template>


<script>

    import AppSearchMenu from "@/components/search-menu.vue"


    export default {
        components: {
            AppSearchMenu
        },
        data() {
            return {
                resultPrecision: 4,
                resultCurrency: null,
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
            ...vp.sync("settings", ["precision", "currency"]),
            ...vp.sync("cp", {
                cpMode: "mode",
                cpAmount: "amount",
                cpSign: "sign",
                cpCurrency: "currency",
                cpNote: "note",
                cpOperationAmount: "operationAmount",
                cpOperationSign: "operationSign",
                cpSaved: "saved"
            }),
            ...vp.sync("currencies", ["wallets"]),
            ...vp.get("currencies", {
                currencies: "list"
            }),
            modeTitle() {
                switch (this.cpMode) {
                    case "wallet-adding": return "Wallet adding"
                    case "wallet-editing": return "Wallet editing"
                    case "result-settings": return "Result settings"
                    case "operation-adding": return "Operation adding"
                }
            },
            amount: {
                get() {
                    return this.cpAmount
                },
                set(v) {
                    this.setAmountSetter("cpAmount", v)
                }
            },
            amountNum() {
                return +this.amount.replace(",", ".")
            },
            precisionValue() {
                if (this.resultPrecision) {
                    return ` 0,${"0".repeat(this.resultPrecision)} `
                } else {
                    return " 0 "
                }
            },
            operationIcon() {
                const icons = {
                    "+%": "plus",
                    "-%": "minus",
                    "*": "times",
                    "/": "divide"
                }
                return `fas fa-${icons[this.cpOperationSign]}`
            },
            operationAmount: {
                get() {
                    return this.cpOperationAmount
                },
                set(v) {
                    this.setAmountSetter("cpOperationAmount", v)
                }
            },
            operationAmountNum() {
                return +this.operationAmount.replace(",", ".")
            }
        },
        watch: {
            precision(v) {
                this.resultPrecision = v
            },
            currency(v) {
                this.resultCurrency = v
            }
        },
        methods: {
            setAmountSetter(key, v) {
                if (!_.isString(v) || !v) {
                    this[key] = "0"
                } else {
                    if (v.replace(/[^,]/g, "").length <= 1) {
                        if (v[0] === "0" && v.length > 1) {
                            const str = v.replace(/^0*/, "")
                            if (str.length) {
                                if (str[0] === ",") {
                                    this[key] = `0${str}`
                                } else {
                                    this[key] = str
                                }
                            } else {
                                this[key] = "0"
                            }
                        } else {
                            this[key] = v
                        }
                    }
                }
            },
            addSymbol(symbol) {
                if (this.cpMode === "wallet-adding" || this.cpMode === "wallet-editing") {
                    this.amount += symbol
                } else if ("operation-adding") {
                    this.operationAmount += symbol
                }
            },
            removeSymbol() {
                if (this.cpMode === "wallet-adding" || this.cpMode === "wallet-editing") {
                    this.amount = this.amount.substr(0, this.amount.length - 1)
                } else if ("operation-adding") {
                    this.operationAmount = this.operationAmount.substr(0, this.operationAmount.length - 1)
                }
            },
            setDefaultValues() {
                this.$nextTick(() => {
                    this.cpSign = true
                    this.cpAmount = "0"
                    this.cpNote = ""
                    this.cpOperationSign = "+%"
                    this.cpOperationAmount = "0"
                    this.resultPrecision = this.precision
                    this.resultCurrency = this.currency
                })
            },
            cancel() {
                this.cpMode = "wallet-adding"
                this.setDefaultValues()
            },
            addWallet() {
                const wallet = {
                    sign: this.cpSign,
                    amount: this.amountNum,
                    currency: this.cpCurrency,
                    note: this.cpNote,
                    operation: null
                }
                const wallets = _.cloneDeep(this.wallets)
                wallets.push(wallet)
                this.wallets = wallets
                this.setDefaultValues()
            },
            editWallet() {
                this.cpSaved = true
                this.cancel()
            },
            addPrecision() {
                if (this.resultPrecision < 10) this.resultPrecision++
            },
            subPrecision() {
                if (this.resultPrecision > 0) this.resultPrecision--
            },
            saveResultSettings() {
                this.precision = this.resultPrecision
                this.currency = this.resultCurrency
                this.cancel()
            },
            changeOperationSign() {
                const signs = ["+%", "-%", "*", "/"]
                let index = signs.indexOf(this.cpOperationSign) + 1
                if (index === signs.length) index = 0
                this.cpOperationSign = signs[index]
            },
            addOperation() {
                this.cpSaved = true
                this.cancel()
            }
        }
    }

</script>
