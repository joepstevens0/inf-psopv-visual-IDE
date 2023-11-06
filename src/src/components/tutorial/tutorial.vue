<template>
  <div class="tutorial">
    <TutorialHint
      v-bind:tutController="tutController"
      v-bind:el="highlight()"
      v-bind:windowWidth="windowWidth()"
      ref="hint"
    ></TutorialHint>
    <TutorialHighlight
      v-bind:tutController="tutController"
      v-bind:canvas="canvas"
      v-bind:blocklist="blocklist"
      ref="highlight"
    ></TutorialHighlight>
    <TutorialSteplist v-bind:tutController="tutController"></TutorialSteplist>
    <TutorialEnd
      v-bind:tutController="tutController"
      v-on:starttut="start"
    ></TutorialEnd>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import ProjectController from "@/datastructures/controllers/projectcontroller";
import TutorialController from "@/datastructures/controllers/tutorialcontroller";

import TutorialHint from "./tutorialhint.vue";
import TutorialHighlight from "./tutorialhighlight.vue";
import TutorialSteplist from "./tutorialsteplist.vue";
import TutorialEnd from "./tutorialend.vue";
import Project from "@/datastructures/project/project";

export default Vue.extend({
  components: {
    TutorialHint,
    TutorialHighlight,
    TutorialSteplist,
    TutorialEnd
  },
  props: {
    controller: {
      validator: function(prop) {
        return prop == null || prop instanceof ProjectController;
      },
      required: true
    },
    canvas: {
      required: true
    },
    blocklist: {
      required: true
    }
  },
  data() {
    return {
      tutController: new TutorialController() as TutorialController
    };
  },
  methods: {
    windowWidth(): number {
      if (this.$el == undefined) return 0;
      return this.$el.clientWidth;
    },
    highlight(): HTMLElement | null {
      if (this.$refs.highlight == undefined) return null;
      return this.$refs.highlight.highlighted;
    },
    /**
     * start a tutorial
     * @param data tutorial information
     */
    start(name: string, data: string) {
      // start new project
      const project = new Project("unnamed");
      const projectcontroller = new ProjectController(project);
      this.$emit("load", project, projectcontroller);

      this.tutController.start(name, data);
    }
  },
  watch: {
    /**
     * update the tutorial projectcontroller on projectcontroller change
     */
    controller: {
      handler(newval: ProjectController, oldval: ProjectController) {
        if (oldval == newval) return;
        if (newval != null) this.tutController.setController(newval);
      },
      immediate: true
    }
  }
});
</script>

<style scoped>
.tutorial {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: absolute;
  pointer-events: none;
  z-index: 3;
}
</style>
