<template>
  <div class="right-container">
    <actionbuttons v-bind:controller="controller"></actionbuttons>
    <imagecanvas
      id="imagecanvas"
      ref="imagecanvas"
      class="spacing border"
      v-bind:project="project"
      v-bind:controller="controller"
    ></imagecanvas>
    <Console
      ref="console"
      id="console1"
      class="spacing border"
      v-bind:project="project"
    ></Console>
    <variableview
      id="variableview"
      class="spacing border"
      v-bind:projectvars="project.getProjectVars()"
      v-bind:controller="controller"
    ></variableview>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import ProjectController from "@/datastructures/controllers/projectcontroller";
import Project from "@/datastructures/project/project";

import Console from "./console.vue";
import imagecanvas from "./imagecanvas.vue";
import actionbuttons from "./actionbuttons.vue";
import variableview from "@/components/blocklists/variableview.vue";

export default Vue.extend({
  components: {
    actionbuttons,
    Console,
    imagecanvas,
    variableview
  },
  props: {
    project: {
      type: Project,
      required: true
    },
    controller: {
      validator: function(prop) {
        return prop == null || prop instanceof ProjectController;
      },
      required: true
    }
  },
  methods: {
    /**
     * reset all consoles
     * @post consoles are reset to original state
     */
    resetConsoles() {
      this.$refs.imagecanvas.reset();
      this.$refs.console.clear();
    }
  }
});
</script>

<style scoped>
.right-container {
  width: 100%;
  height: calc(100% - 10px);
}
.spacing {
  margin-left: 5px;
  margin-bottom: 5px;
}
.border {
  border: 1px solid black;
}
#imagecanvas {
  height: calc(38% - (0.4 * 73px) - 5px);
}
#console1 {
  height: calc(30% - (0.4 * 73px));
}
#variableview {
  height: calc(27% - (0.2 * 73px));
}
</style>
