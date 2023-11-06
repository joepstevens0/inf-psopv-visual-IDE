<template>
  <ul class="steplist">
    <li v-for="(step, index) in steps" :key="index" class="step">
      <div class="stepliststep">
        <div class="stepel">Message: {{ step.message }}</div>
        <div class="stepel">Highlight: {{ step.highlight }}</div>
        <div class="stepel">Action: {{ step.action }}</div>
        <div class="stepel">
          Volgende knop: {{ step.nextbutton ? "ja" : "nee" }}
        </div>
      </div>
      <div v-show="index > 0" @click="moveUp(index)" class="movebutton">/\</div>
      <div @click="removeStep(index)" class="stepremovebutton">X</div>
      <div
        v-show="index < steps.length - 1"
        @click="moveDown(index)"
        class="movebutton"
      >
        \/
      </div>
      <div style="clear: both;"></div>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from "vue";
import Logger from "@/util/logger";

type Step = {
  message: string;
  highlight: string;
  action: string;
  nextbutton: boolean;
};

export default Vue.extend({
  data() {
    return {
      steps: [] as Step[]
    };
  },
  methods: {
    /**
     * remove a step from the steplist
     * @param index of step (first step = 0)
     * @pre 0 <= index < steps.length
     */
    removeStep(index: number) {
      this.steps.splice(index, 1);
    },
    /**
     * Switch a step and the step before from place
     * @param index of step (first step = 0)
     * @pre 0 < index < steps.length
     */
    moveUp(index: number) {
      Logger.debug("Tutorialcreate |", "moving step", index, "up");
      const temp = this.steps[index];
      this.$set(this.steps, index, this.steps[index - 1]);
      this.$set(this.steps, index - 1, temp);
    },
    /**
     * Switch a step and the step after from place
     * @param index of step (first step = 0)
     * @pre 0 <= index < steps.length -1
     */
    moveDown(index: number) {
      Logger.debug("Tutorialcreate |", "moving step", index, "down");
      const temp = this.steps[index];
      this.$set(this.steps, index, this.steps[index + 1]);
      this.$set(this.steps, index + 1, temp);
    },
    /**
     * add step to the back of the steplist
     */
    addStep(step: Step) {
      this.steps.push(step);
    },
    /**
     * transform steplist in a tutorial data string
     */
    createTutorial(): string {
      let result = "";
      for (let i = 0; i < this.steps.length; ++i) {
        const step = this.steps[i];
        if (step.message == "") step.message = " ";
        result += "m:'" + step.message + "'\n";
        if (step.highlight != "noTarget") {
          result += "h:" + step.highlight + "\n";
        }
        if (step.action != "noAction") {
          result += "c:" + step.action + "\n";
        }
        if (step.nextbutton) result += "n\n";
        result += "|";
      }
      return result;
    },
    /**
     * remove all steps from list
     */
    clear() {
      this.steps = [];
    },
    load(tutorialdata: string) {
      this.steps = [];
      const steps = tutorialdata.split("|");
      for (let i = 0; i < steps.length - 1; ++i) {
        const step: Step = {
          message: "",
          highlight: "",
          action: "",
          nextbutton: false
        };
        const stepparts = steps[i].split("\n");
        for (let j = 0; j < stepparts.length; ++j) {
          const part = stepparts[j];
          if (part.startsWith("m:"))
            step.message = part.substring(
              part.indexOf("'") + 1,
              part.length - 1
            );
          else if (part.startsWith("h:")) {
            step.highlight = part.substring(part.indexOf(":") + 1);
          } else if (part.startsWith("c:")) {
            step.action = part.substring(part.indexOf(":") + 1);
            if (step.action.startsWith("newBlock>")) {
              const blockname = step.highlight.substring(step.highlight.indexOf(">")+1);

              this.$emit(
                "addRef",
                step.action.substring(step.action.indexOf(">") + 1),
                blockname
              );
            }
          } else if (part.startsWith("n")) step.nextbutton = true;
        }
        this.steps.push(step);
      }
    }
  }
});
</script>

<style scoped>
.steplist {
  width: 40%;
  float: right;
  border: 1px solid white;
  border-radius: 15px;
  height: 600px;
  overflow: auto;
  padding: 0;
}
.step {
  list-style: none;
  border-bottom: 1px solid white;
  padding: 10px;
}
.stepel {
  width: 100%;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}
.stepliststep {
  width: 90%;
  float: left;
}
.stepremovebutton {
  float: right;
  color: red;
  right: right;
  position: relative;
  margin: 0;
  padding: 0;
  cursor: pointer;
  width: 30px;
  height: 30px;
  font-size: 30px;
  font-family: Arial, sans-serif;
  font-weight: 300;
}
.stepremovebutton:hover {
  opacity: 0.3;
  cursor: pointer;
}

.movebutton {
  border: 1px solid white;
  border-radius: 10px;
  float: right;
  color: white;
  right: right;
  position: relative;
  margin: 4px 9px 4px 0px;
  margin-right: 9px;
  padding: 0;
  cursor: pointer;
  width: 20px;
  height: 25px;
  font-size: 20px;
  font-family: Arial, sans-serif;
  font-weight: 300;
  text-align: center;
}

.movebutton:hover {
  opacity: 0.5;
  cursor: pointer;
}
</style>
