<template lang="pug">
    
    v-tooltip(
        transition="slide-x-transition"
        open-delay="600"
        close-delay="200"
        nudge-right="-5"
        right
    )
        template(v-slot:activator="{ on }")
            v-list-item(
                v-on="on"
                @click="click"
            )
                v-list-item-icon
                    v-icon {{ icon }}
                v-list-item-content
        span {{ tooltip }}

</template>


<script>

    export default {
        props: ["tooltip", "icon", "click"]
    }

</script>
