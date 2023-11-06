<template>
  <g class="choiceview">
    <foreignObject y="4" rx="20" ry="20" ref="foreign">
      <select
        ref="select"
        @mousedown="$event.stopPropagation()"
        class="choices"
        v-on:change="choiceChange($event.target)"
        @keydown="$event.preventDefault()"
      >
        <option
          v-for="(option, index) in component.getOptions()"
          :key="index"
          :value="option"
          >{{ option }}</option
        >
      </select>
    </foreignObject>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import { ChoiceComponent } from "@/datastructures/block/blockcomponents/blockcomponents";
import ProjectController from "@/datastructures/controllers/projectcontroller";

export default Vue.extend({
  props: {
    component: {
      type: ChoiceComponent,
      required: true
    },
    controller: {
      type: ProjectController,
      required: false
    }
  },
  mounted() {
    this.$emit("setPos", "base");
    this.$refs.select.selectedIndex = this.component.selectedIndex();
    this.$nextTick(() => {
      this.$nextTick(() => {
        this.updateSize();
      });
    });
  },
  methods: {
    sendHeight: function(h: number) {
      this.$emit("heightUpdate", h);
    },
    sendWidth: function(w: number) {
      this.$emit("widthUpdate", w);
    },
    choiceChange(target: HTMLSelectElement) {
      this.component.setValue(target.selectedIndex);
    },
    updateSize() {
      let height = this.$refs.select.clientHeight;
      let width = this.$refs.select.clientWidth;
      if (height < 25) height = 25;
      if (width < 30) width = 30;
      this.sendHeight(height);
      this.sendWidth(width);
      this.$refs.foreign.setAttribute("height", height + 10 + "px");
      this.$refs.foreign.setAttribute("width", width + 10 + "px");
    }
  },
  watch: {
    component: {
      handler() {
        this.$refs.select.selectedIndex = this.component.selectedIndex();
        this.$nextTick(() => {
          this.updateSize();
        });
      },
      deep: true
    }
  }
});
</script>
<style scoped>
.choices {
  background-color: white;
  border-radius: 10px;
  padding: 3px;
  margin: 0px;
}
</style>
