<template>
  <div class="stepcreate">
    <div class="stepmessage">
      Bericht:
      <input
        ref="messageinput"
        class="messageinput"
        placeholder="Schrijf de uitleg hier"
      />
    </div>
    Kies wat er aangeduid wordt:
    <tutorialcreatetargets
      v-bind:blocklist="blocklist"
      ref="targetselect"
    ></tutorialcreatetargets>
    Kies hoe een stap voltooid kan worden:
    <tutorialcreateactions
      ref="actionselect"
      v-on:newblockref="addBlockRef"
    ></tutorialcreateactions>
    <div class="nextbuttonchoose" ref="nextbuttonchoose">
      Volgende knop:
      <input
        type="radio"
        name="nextbutton"
        @change="selectedNextButton = true"
      />Ja
      <input
        type="radio"
        name="nextbutton"
        @change="selectedNextButton = false"
        checked="checked"
        ref="noNextButton"
      />Nee
    </div>
    <button class="stepfinish" v-on:click="stepFinish">
      Voeg stap toe
    </button>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import tutorialcreatetargets from "./tutorialcreatetargets.vue";
import tutorialcreateactions from "./tutorialcreateactions.vue";

type Step = {
  message: string;
  highlight: string;
  action: string;
  nextbutton: boolean;
};

export default Vue.extend({
  components: {
    tutorialcreateactions,
    tutorialcreatetargets
  },
  props: {
    blocklist: {
      required: true
    }
  },
  methods: {
    /**
     * create new step from select options and send to parent component
     * @post resets step creation
     */
    stepFinish() {
      const step: Step = {
        message: this.$refs.messageinput.value,
        highlight: this.$refs.targetselect.getSelected(),
        action: this.$refs.actionselect.getSelected(),
        nextbutton: this.selectedNextButton
      };

      this.$emit("newstep", step);
      this.resetStepCreation();
    },
    /**
     * reset the option to default state
     */
    resetStepCreation() {
      this.$refs.targetselect.reset();
      this.$refs.actionselect.reset();
      (this.$refs.messageinput as HTMLInputElement).value = "";
      (this.$refs.noNextButton as HTMLInputElement).checked = true;
      this.selectedNextButton = false;
    },
    /**
     * add a blockreference to blocktargets
     */
    addBlockRef(refname: string, blockname = "") {
      this.$refs.targetselect.addBlockRef(refname, blockname);
    },
    /**
     * reset stepcreation en clear block references
     */
    clear() {
      this.$refs.targetselect.clear();
      this.resetStepCreation();
    }
  }
});
</script>

<style scoped>
.stepcreate {
  width: 50%;
  display: inline-block;
  border: 1px solid white;
  border-radius: 15px;
  padding: 10px;
}
.stepfinish {
  margin-right: 60px;
  margin-top: 30px;
  margin: 5px;
  background-color: var(--basicbutton);
  border: 1px solid var(--basicbuttonbordercolor);
  border-radius: 10px;
  color: white;
  padding: 10px;
  width: 100%;
}
.stepfinish:hover {
  background-color: var(--basicbuttonhovercolor);
  cursor: pointer;
}
.stepmessage {
  margin-bottom: 5px;
}
</style>
