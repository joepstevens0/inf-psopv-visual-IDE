<template>
  <div class="actionbuttons">
    <img
      draggable="false"
      src="@/assets/img/play-48.png"
      alt="Startknop"
      id="startknop"
      class="actionbutton"
      v-on:click="controller.getExecController().onStart('start')"
    />
    <img
      draggable="false"
      src="@/assets/img/octagon-48.png"
      alt="Stopknop"
      id="stopknop"
      class="actionbutton"
      v-on:click="controller.getExecController().onStop()"
    />
    <img
      draggable="false"
      src="@/assets/img/media-step-forward-48.png"
      alt="Stepknop"
      id="stepknop"
      class="actionbutton"
      v-on:click="controller.getExecController().onStep('start')"
    />
    <img
      draggable="false"
      src="@/assets/img/undo-2-48.png"
      alt="Undoknop"
      id="undoknop"
      class="actionbutton"
      v-on:click="onUndo"
    />
    <img
      draggable="false"
      src="@/assets/img/redo-2-48.png"
      alt="Redoknop"
      id="redoknop"
      class="actionbutton"
      v-on:click="onRedo"
    />
    <div class="speedslider">
      vertraging
      <input ref="speedslider" v-on:input="updateSpeed" type="range" min="0" max="2" step="0.25" value="1" class="slider" @keydown="$event.preventDefault()">
      <label ref="speedlabel">1s</label>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import ProjectController from "@/datastructures/controllers/projectcontroller";

export default Vue.extend({
  props: {
    controller: {
      validator: function(prop) {
        return prop == null || prop instanceof ProjectController;
      },
      required: true
    }
  },
  methods: {
    onUndo() {
      this.controller.getActionController().onUndo();

      // never undo in selected state
      if (this.controller.getDragController().getSelectedBlock() != null)
        this.onUndo();
    },
    onRedo() {
      this.controller.getActionController().onRedo();

      // never undo in selected state
      if (this.controller.getDragController().getSelectedBlock() != null)
        this.onRedo();
    },
    keypress(event: KeyboardEvent){
      this.controller.getExecController().onStart(event.key);
    },
    updateSpeed(event: InputEvent){
      const newspeed = event.target.value;
      this.$refs.speedlabel.innerHTML = newspeed + "s";
      this.controller.getExecController().setStartSpeed(newspeed * 1000);
    }
  },
  mounted() {
    // add key listeners
    window.addEventListener("keydown", this.keypress);
  },
  beforeDestroy() {
    // remove key listeners
    window.removeEventListener("keydown", this.keypress);
  },
  watch: {
    controller:{
      handler(){
        const speed = this.$refs.speedslider.value;
        this.controller.getExecController().setStartSpeed(speed * 1000);
      }
    }
  }
});
</script>

<style scoped>
.actionbutton {
  /*float: left;*/
  padding: 5px;
  margin: 5px;
  width: 50px;
}
.actionbutton:hover {
  -webkit-filter: drop-shadow(3px 3px 3px #222);
  filter: drop-shadow(3px 3px 3px #222);
  cursor: pointer;
}
.actionbutton:active {
  transform: translateY(1px);
}

.speedslider {
  color: white;
  width: 150px;
  padding: 5px;
  display: inline-block;
  margin: 5px;
  line-height: 15px;
  border-radius: 15px;
  text-align: center;
  vertical-align: top;
  background-color: var(--headercolor);
}
.slider {
  clear: both;
  width: 90%;
}
</style>
