<template>
  <g class="apiconnectview">
    <rect
      v-if="!component.attached()"
      class="invisible invisibleAPIConnect"
      ref="attachsilhouette"
      x="0"
      y="-40"
      rx="10"
      ry="10"
      width="65"
      height="40"
      @mouseup="mouseReleased"
      @mouseover="onHover"
      @mouseleave="deHover"
      @mousedown="$event.stopPropagation()"
    />

    <!-- Create triangle instead of circle -->
    <path
      d="M 30 14 L 15 -1 L 45 -1 z"
      ref="halftriangle"
      class="halftriangle"
    />
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import { APIConnectComponent } from "@/datastructures/block/blockcomponents/blockcomponents";
import ProjectController from "@/datastructures/controllers/projectcontroller";

export default Vue.extend({
  props: {
    component: {
      type: APIConnectComponent,
      required: true
    },
    controller: {
      type: ProjectController,
      required: false
    }
  },
  mounted() {
    this.sendHeight(0);
    this.sendWidth(5);
    this.$emit("setPos", "top");
  },
  methods: {
    sendHeight: function(h: number) {
      this.$emit("heightUpdate", h);
    },
    sendWidth: function(w: number) {
      this.$emit("widthUpdate", w);
    },
    // Checks if silhouette needs to be shown when hovered over
    onHover: function() {
      //Only show silhouette if a block can be attached
      if (
        this.controller != null &&
        this.controller.getDragController().getSelectedBlock() != null
      ) {
        //Only show silhouette if the holded block can be attached
        if (
          this.controller
            .getDragController()
            .getSelectedBlock()
            .hasComponent("APIAttach") && !this.component.attached()
        ) {
          this.$refs.attachsilhouette.style.stroke = "black";
          this.$refs.halftriangle.style.stroke = "black";
        }
      }
    },

    // Hides silhouette again when not hovering over it
    deHover: function() {
      if (this.$refs.attachsilhouette) {
        this.$refs.attachsilhouette.style.stroke = "none";
        this.$refs.halftriangle.style.stroke = "none";
      }
    },
    // Checks if a block needs to be connected when mouse is released on the silhouette
    mouseReleased: function(event: MouseEvent) {
      if (this.component.attached()) return;
      
      const selectedblock = this.controller
        .getDragController()
        .getSelectedBlock();
      if (this.controller != null && selectedblock != null) {
        //Only connect the block if it can be connected
        if (selectedblock.hasComponent("APIAttach")) {
          // getblockheight of block, remove 40 because of extra attachcomponent height
          let blockheight =
            document
              .getElementById("block" + selectedblock.getId())
              .getBoundingClientRect().height - 40;
          if (selectedblock.hasComponent("APIConnect")) blockheight -= 40; // remove 40 of extra connect component height
          this.controller
            .getBlockController()
            .APIconnectBlock(selectedblock, this.component, blockheight);
        }
      }
    }
  }
});
</script>

<style scoped>
.invisible {
  fill: transparent;
  stroke: none;
}

.halftriangle {
  fill: var(--backgroundcolor);
}
</style>
