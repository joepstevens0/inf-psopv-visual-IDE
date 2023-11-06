<template>
  <div id="app" @mousemove="moveGlobalBlock">
    <div class="header item1">
      <Header
        v-bind:project="project"
        v-bind:projectcontroller="projectController"
        v-bind:canvas="$refs.canvas"
        v-bind:blocklist="$refs.blocklist"
        v-on:load="load"
      ></Header>
    </div>

    <div class="main">
      <div class="item2">
        <blocklist
          ref="blocklist"
          :projectController="projectController"
          :key="allloaded"
        ></blocklist>
      </div>

      <div class="item3">
        <Canvas
          ref="canvas"
          v-bind:project="project"
          :projectController="projectController"
          :key="allloaded"
        ></Canvas>
      </div>

      <div class="item4">
        <Output
          ref="output"
          v-bind:controller="projectController"
          v-bind:project="project"
        ></Output>
      </div>
    </div>

    <globalBlock :projectController="projectController"></globalBlock>
  </div>
</template>

<script lang="ts">
import colorinit from "./colorinit";
colorinit();

import Vue from "vue";
import blocklist from "./blocklists/blocklist.vue";
import Canvas from "./canvas/canvas.vue";
import Project from "@/datastructures/project/project";
import ProjectController from "@/datastructures/controllers/projectcontroller";
import Header from "./header/header.vue";
import Output from "./iocomponents/output.vue";
import globalBlock from "./globalBlock.vue";

export default Vue.extend({
  components: {
    Header,
    Output,
    blocklist,
    Canvas,
    globalBlock
  },
  data() {
    return {
      clientX: 0,
      clientY: 0,
      globalBlockInitialX: 0,
      globalBlockInitialY: 0,
      project: new Project("unnamed") as Project,
      projectController: null as ProjectController | null,
      allloaded: false,
      resizeWarning: true,
      displaySaveButton: false
    };
  },
  computed: {
    globalX() {
      if (this.projectController?.getDragController().getSelectedBlock()) {
        return (
          this.projectController.getDragController().getClientPos()[0] -
          this.projectController.getDragController().getSelectedOffset()[0]
        );
      } else {
        return 0;
      }
    },
    globalY() {
      if (this.projectController?.getDragController().getSelectedBlock()) {
        return (
          this.projectController.getDragController().getClientPos()[1] -
          this.projectController.getDragController().getSelectedOffset()[1]
        );
      } else {
        return 0;
      }
    }
  },
  mounted() {
    // refresh warning
    window.onbeforeunload = function() {
      return "Alles wat niet is opgeslagen zal verloren gaan.";
    };

    // Init projectController
    this.projectController = new ProjectController(this.project);

    // Add alert when window resizes
    // ui is now responsive so no resize message needed anymore
    /*window.addEventListener(
      "resize",
      function() {
        alert(
          "LET OP! Deze applicatie werkt het best in volledige schermweergave!"
        );
      },
      { once: true }
    );*/

    // Force an update for height of canvas **DOES IT FOR CHROME, NOT FIREFOX**
    this.$refs.canvas.$forceUpdate();
  },
  methods: {
    moveGlobalBlock(evt: any) {
      if (this.projectController?.getDragController().getSelectedBlock()) {
        this.projectController.getDragController().setClientPos([evt.clientX, evt.clientY]);
      }
    },
    load(project: Project, projectcontroller: ProjectController) {
      this.project = project;
      this.projectController = projectcontroller;
      // reset image and output console
      this.$refs.output.resetConsoles();
    }
  },
  watch: {}
});
</script>

<style>
@import url(../assets/colorvars.css);
body {
  margin: 0;
  user-select: none;
  background-color: var(--appbackgroundcolor);
  min-height: 100%;
  height: 100vh;
  /*overflow: hidden;*/
  font-family: Arial, Helvetica, sans-serif;
}
</style>
<style scoped>
.item1 {
  grid-area: Header;
}
.item2 {
  grid-area: Blocklist;
  max-width: 280px;
  height: calc(100% - 47px);
  margin-top: 5px;
}
.item3 {
  grid-area: Canvas;
  display: inline-block;
  width: -webkit-fill-available;
  height: calc(100% - 47px);
  margin-top: 5px;
}
.item4 {
  grid-area: Output;
  /*height: 70%;*/
  min-width: 362px;
  max-width: 900px;
  display: inline-block;
  width: 50%;
}
.main {
  display: flex;
  min-height: -webkit-fill-available;
  height: inherit;
}

.grid-container {
  display: grid;
  grid-template-areas:
    "Header Header Header Header Header Header"
    "Blocklist Canvas Canvas Canvas Output Output"
    "Blocklist Canvas Canvas Canvas Output Output"
    "Blocklist Canvas Canvas Canvas Output Output"
    "Blocklist Canvas Canvas Canvas Var Var";
  grid-gap: 0px;
}
#overlay {
  width: 100%;
  height: 100%;
}
#container {
  margin: auto;
  width: 100%;
  height: 100%;
  float: left;
}

#app {
  padding: 0;
  margin: 0;
  max-height: 99.5%;
  min-width: 1250px;
  overflow-y: hidden;
  overflow-x: hidden;
  height: 100%;
}
</style>
