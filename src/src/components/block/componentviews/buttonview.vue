<template>
  <g class="buttonview" @mousedown="$event.stopPropagation()" @mouseup="$event.stopPropagation()">
    <foreignObject :width="_text.length * 10" height="30">
    <form @submit.prevent="executeFunction">
      <button 
        type="submit" 
        class="submitbutton" 
        :style="'background:'+_color"
        @mousedown="$event.stopPropagation()"
        >
            {{ _text }}
        </button>
    </form>
    </foreignObject>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import { ButtonComponent } from "@/datastructures/block/blockcomponents/blockcomponents";
import ProjectController from "@/datastructures/controllers/projectcontroller";


export default Vue.extend({
  props: {
    component: {
      type: ButtonComponent,
      required: true
    },
    controller: {
      type: ProjectController,
      required: false
    }
  },
  computed: {
    _func(): Function {
      return this.component.getFunction();
    },
    _text(): string {
      return this.component.getText();
    },
    _color(): string {
        return this.component.getColor();
    }
  },
  mounted() {
    this.sendHeight(30);
    this.sendWidth(this._text.length * 8);
    this.$emit("setPos", "base");
  },
  methods: {
    sendHeight: function(h: number) {
      this.$emit("heightUpdate", h);
    },
    sendWidth: function(w: number) {
      this.$emit("widthUpdate", w);
    },

    // On buttonpress: execute Function
    executeFunction(): void {
        this.component.executeFunction();
    }
  }
});
</script>

<style scoped>
.submitbutton {
    color: white;
    font-family: Arial, Helvetica, sans-serif;
    text-shadow: -0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000;
    border-radius: 10px;
    padding: 5px;
}

text{
    fill: white;
    font-family: Arial, Helvetica, sans-serif;
    text-shadow: -0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000;
}
</style>
