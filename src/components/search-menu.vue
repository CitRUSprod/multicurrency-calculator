<template lang="pug">
    
    v-sheet.elevation-2.v-overflow-btn--segmented.overflow-hidden
        v-overflow-btn.ma-0(
            :items="items"
            :label="label"
            v-model="value"
            hide-details
            editable
        )
            template(v-slot:item="{ item }")
                v-divider(v-if="item.disabled")
                b(v-else) {{ item.text }}

</template>


<script>

    export default {
        props: ["items", "label"],
        data() {
            return {
                value: null
            }
        },
        watch: {
            value(v) {
                this.$emit("input", v)
            }
        }
    }

</script>
