<template>
  <div
    v-if="tutController.getMessage() != ''"
    class="hint"
    ref="hint"
    v-bind:style="hintstyle"
  >
    <span v-bind:class="{ texthighlight: textHighlight }">
      {{ tutController.getMessage() }}
    </span>
    <div class="hintbuttons">
      <div
        class="nextbutton hintbutton"
        v-if="tutController.hasNextbutton()"
        v-on:click="onNext"
      >
        volgende
      </div>
      <div class="stopbutton hintbutton" v-on:click="onStop">stoppen</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import TutorialController from "@/datastructures/controllers/tutorialcontroller";

const HINTMARGIN = 20;

export default Vue.extend({
  props: {
    tutController: {
      type: TutorialController,
      required: true
    },
    el: {
      required: true
    },
    windowWidth: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      x: 0,
      y: 0,
      textHighlight: false
    };
  },
  computed: {
    /**
     *  style position for the hint
     */
    hintstyle(): string {
      this.updateX();
      this.updateY();
      return "left:" + (this.x + window.scrollX) + "px;top:" + (this.y + window.scrollY) + "px;";
    }
  },
  methods: {
    /**
     * Update the x position of the hint
     */
    updateX() {
      // if no highlighted element, position hint in the middle of the window
      if (this.el == null) {
        this.x = this.windowWidth / 2 - this.$el.clientWidth / 2;
        return;
      }

      // standard position is to the right of highlighted element
      const rect = (this.el as HTMLElement).getBoundingClientRect();
      this.x = rect.right + HINTMARGIN;

      // if no space to the right, put to the left of the element
      if (this.x > this.windowWidth)
        this.x = rect.left - HINTMARGIN - this.$el.clientWidth;
    },
    /**
     * Update the y position of the hint
     */
    updateY() {
      // top of the window if no highlighted element
      if (this.el == null) {
        this.y = HINTMARGIN;
        return;
      }

      // position in the middle of the highlighted element
      const rect = (this.el as HTMLElement).getBoundingClientRect();
      this.y = rect.top + rect.height / 2;
    },
    /**
     * called when stop button is pressed. this stops the the tutorial
     */
    onStop() {
      this.tutController.stop();
    },
    /**
     * called when next button is pressed. Next step of the tutorial will be shown
     */
    onNext() {
      if (this.tutController.isActionComplete()) {
        this.textHighlight = false;
        this.tutController.next();
      } else {
        this.textHighlight = true;
        setTimeout(() => {
          this.textHighlight = false;
        }, 3000);
      }
    }
  },
  watch: {
    /**
     * update the tutorial projectcontroller on projectcontroller change
     */
    el: {
      handler(newval: HTMLElement| null, oldval: HTMLElement| null) {
        this.updateX();
        this.updateY();
      }
    }
  }
});
</script>

<style scoped>
.hint {
  min-width: 100px;
  max-width: 400px;
  min-height: 50px;
  position: fixed;
  background-color: rgb(108, 172, 108);
  color: white;
  pointer-events: all;
  border-radius: 20px;
  padding: 15px;
  z-index: 3;
  user-select: text;
}
.hintbuttons {
  width: 100%;
  text-align: center;
  float: bottom;
  margin: 5px;
  margin-bottom: 0;
}
.hintbutton {
  display: inline-block;
  border-radius: 20px;
  border: 1px black;
  padding: 10px;
  margin: 5px;
  margin-bottom: 0;
}
.hintbutton:hover {
  cursor: pointer;
}
.stopbutton {
  background-color: red;
}
.nextbutton {
  background-color: rgb(90, 211, 90);
}
.nextbutton:hover {
  background-color: rgb(128, 211, 128);
}
.stopbutton:hover {
  background-color: rgb(230, 65, 65);
}
span {
  white-space: pre-line;
}
.texthighlight {
  color: red;
}
</style>
