<template>
  <g class="labelview">
    <text x="-5" y="22" fill="white">{{ _text }}</text>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import { LabelComponent } from "@/datastructures/block/blockcomponents/blockcomponents";
import ProjectController from "@/datastructures/controllers/projectcontroller";

export default Vue.extend({
  props: {
    component: {
      type: LabelComponent,
      required: true
    },
    controller: {
      type: ProjectController,
      required: false
    }
  },
  computed: {
    _text(): string {
      return this.component.getText();
    },
    elWidth(): number{
      if (this.$el == undefined) return 0;
      return (this.$el as HTMLElement).getBoundingClientRect().width;
    }
  },
  mounted() {
    this.sendHeight(20);
    this.updateWidth();
    this.$emit("setPos", "base");
  },
  methods: {
    sendHeight: function(h: number) {
      this.$emit("heightUpdate", h);
    },
    sendWidth: function(w: number) {
      this.$emit("widthUpdate", w);
    },
    /**
     * update the width of the label
     */
    updateWidth() {
      // Wait 2 ticks to make sure the block is fully loaded
      Vue.nextTick(() => {
        Vue.nextTick(() => {
          let width = (this.$el as HTMLElement).getBoundingClientRect().width;
          if (width <= 0) width = this._text.length * 7;
          this.sendWidth(width);
        });
      });
    }
  },
  updated() {
    this.updateWidth();
  },
  watch: {
    elWidth: {
      handler() {
        this.updateWidth();
      },
      deep: true,
      immediate: true
    }
  }
});
</script>

<style scoped>
text {
  font-family: Arial, Helvetica, sans-serif;
  text-shadow: -0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000,
    0.5px 0.5px 0 #000;
}
</style>
