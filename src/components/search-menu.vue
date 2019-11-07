<template lang="pug">
    
    v-autocomplete(
        :items="formattedItems"
        :label="label"
        :search-input.sync="search"
        :menu-props="{ closeOnContentClick: true }"
        :filter="customFilter"
        v-model="chosen"
        @focus="focused = true"
        @blur="focused = false"
        return-object
        hide-details
        solo
    )
        template(v-slot:item="{ item }")
            b(v-if="item.title") {{ item.text }}
            span.pl-4(v-else) {{ item.text }}

</template>


<script>

    export default {
        props: ["value", "items", "label"],
        data() {
            return {
                search: "",
                focused: false
            }
        },
        computed: {
            chosen: {
                get() {
                    return this.value
                },
                set(v) {
                    this.$emit("input", v)
                }
            },
            groups() {
                let groups = {}
                for (const item of this.items) {
                    if (item.group) {
                        if (this.focused) {
                            groups[item.value] = _.filter(item.elements, el => {
                                const text = el.text.toLowerCase()
                                const search = this.search.toLowerCase()
                                return !!~text.indexOf(search)
                            })
                        } else {
                            groups[item.value] = item.elements
                        }
                    }
                }
                return groups
            },
            formattedItems() {
                if (_.isArray(this.items)) {
                    let items = []
                    for (const item of this.items) {
                        if (item.group) {
                            items.push({
                                title: true,
                                text: item.text,
                                value: item.value,
                                disabled: true
                            })
                            items.push(...item.elements)
                        } else {
                            items.push(item)
                        }
                    }
                    return items
                } else {
                    return []
                }
            }
        },
        watch: {
            focused(v) {
                if (!v && !this.chosen) this.selectFirst()
            }
        },
        methods: {
            selectFirst() {
                const items = _.reject(this.formattedItems, { title: true })
                if (items.length) this.chosen = items[0]
            },
            customFilter(item, search) {
                if (item.title) {
                    return !!this.groups[item.value].length
                } else {
                    const text = item.text.toLowerCase()
                    return !!~text.indexOf(search.toLowerCase())
                }
            }
        },
        mounted() {
            if (!this.chosen) this.selectFirst()
        }
    }

</script>
