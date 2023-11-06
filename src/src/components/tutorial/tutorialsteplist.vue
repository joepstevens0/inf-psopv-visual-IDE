<template>
  <div v-show="tutController.getCompleted().length > 0 && !tutController.finished()" class="completedlist">
    <button class="completedbutton" v-on:click="toggle">
      Voltooide stappen
    </button>
    <ul v-show="stepsopen" class="completedsteps">
      <li
        class="completedstep"
        v-for="(step, index) in tutController.getCompleted()"
        :key="index"
      >
        {{ index + 1 + ": " + step }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import TutorialController from "@/datastructures/controllers/tutorialcontroller";

export default Vue.extend({
  props: {
    tutController: {
      type: TutorialController,
      required: true
    }
  },
  data() {
    return {
      stepsopen: false as boolean
    };
  },
  methods: {
    /**
     * open steplist if closed, close if open
     */
    toggle() {
      this.stepsopen = !this.stepsopen;
    }
  }
});
</script>

<style scoped>
.completedlist {
  border-radius: 10px;
  right: 0;
  top: 40px;
  position: absolute;
  z-index: 3;
  background-color: var(--headercolor);
  pointer-events: all;
  margin: 10px;
}
.completedsteps {
  clear: both;
  margin: 5px;
  list-style: none;
  padding-left: 0;
  padding-right: 10px;
}
.completedstep {
  width: 100%;
  border: 1px solid black;
  border-radius: 10px;
  list-style: none;
  padding: 5px;
  margin-bottom: 5px;
  background-color: white;
}

.completedbutton {
  float: right;
  border-radius: 20px;
  border: 1px solid rgb(31, 76, 97);
  padding: 10px;
  margin: 5px;

  background-color: #45c539;
}
.completedbutton:hover {
  cursor: pointer;
  background-color: #2f9426;
}
</style>
