<template>
  <router-view v-if="rightBrowser"></router-view>
  <div v-else><p>Deze browser wordt niet ondersteund.</p> <p>Google Chrome of Mozilla Firefox wordt aangeraden voor het gebruik van deze applicatie</p></div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  components: {
  },
  data() {
    return {
    };
  },
  computed: {
    //Returns true if browser is not IE or Edge
    rightBrowser() {
      // Internet Explorer 6-11
      const isIE = /*@cc_on!@*/false || !!document.documentMode;

      // Edge 20+
      const isEdge = !isIE && !!window.StyleMedia;

      return (!isIE && !isEdge);
    }
  },
  mounted() {
    //
  },
  methods: {
  },
    
});
</script>

<style scoped>
div {
  border: 1px solid #0387da;
  margin-top: 20%;
  margin-left: 40%;
  margin-right: 40%;
  background-color: #0387da;
}
p {
  text-align: center;
  color: white;
}

</style>
