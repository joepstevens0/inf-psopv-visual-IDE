<template>
  <g class="startview">
    <!-- TODO SET WIDTH TO WIDTH OF BASE BLOCK -->
    <ellipse cx="35" cy="20" rx="35" ry="20" :fill="_color" />
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import { StartComponent } from "@/datastructures/block/blockcomponents/blockcomponents";
import ProjectController from "@/datastructures/controllers/projectcontroller";


export default Vue.extend({
  props: {
    component: {
      type: StartComponent,
      required: true
    },
    controller: {
      type: ProjectController,
      required: false
    }
  },
  computed: {
    _color(): string {
      return this.component.getColor();
    }
  },
  mounted() {
    this.sendHeight(10);
    this.sendWidth(200);
    this.$emit("setPos", "top");
  },
  methods: {
    sendHeight: function(h: number) {
      this.$emit("heightUpdate", h);
    },
    sendWidth: function(w: number) {
      this.$emit("widthUpdate", w);
    }
  }
});
</script>
