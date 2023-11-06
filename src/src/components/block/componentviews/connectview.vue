<template>
  <g class="connectview">
    <rect
      v-if="!component.attached()"
      class="invisible invisibleConnect"
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
      @mousedown="mousedown"
    />

    <path d="M15,-1 a1,1 0 0,0 30,0" class="halfcircle" ref="halfcircle" />
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import { ConnectComponent } from "@/datastructures/block/blockcomponents/blockcomponents";
import ProjectController from "@/datastructures/controllers/projectcontroller";

import Block from "../../../datastructures/block/block";

export default Vue.extend({
  props: {
    component: {
      type: ConnectComponent,
      required: true
    },
    controller: {
      type: ProjectController,
      required: false
    }
  },
  computed: {
    _notattached(): boolean {
      return this.component.getNext() == null;
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
            .hasComponent("Attach")
        ) {
          this.$refs.attachsilhouette.style.stroke = "black";
          this.$refs.halfcircle.style.stroke = "black";
        }
      }
    },

    // Hides silhouette again when not hovering over it
    deHover: function() {
      if (this.$refs.attachsilhouette) {
        this.$refs.attachsilhouette.style.stroke = "none";
        this.$refs.halfcircle.style.stroke = "none";
      }
    },
    // Checks if a block needs to be connected when mouse is released on the silhouette
    mouseReleased: function(event: MouseEvent) {
      if (this.controller == null) return;
      const selectedblock = this.controller
        .getDragController()
        .getSelectedBlock();
      if (selectedblock == null) return;
      //Only connect the block if it can be connected
      if (selectedblock.hasComponent("Attach")) {
        // getblockheight of block, remove 40 because of extra attachcomponent height
        let blockheight =
          document
            .getElementById("block" + selectedblock.getId())
            .getBoundingClientRect().height - 40;
        if (selectedblock.hasComponent("Connect")) blockheight -= 40; // remove 40 of extra connect component height
        this.controller
          .getBlockController()
          .connectBlock(selectedblock, this.component, blockheight);
      }
    },
    /**
     * send mousedown event to element below the invisible silouette
     */
    mousedown(event: MouseEvent) {
      event.stopPropagation();
      this.$el.style.pointerEvents = "none";
      const below = document.elementFromPoint(
        event.clientX,
        event.clientY
      ) as HTMLElement | null;
      if (below != null) {
        const ev = new MouseEvent("mousedown", {
          view: event.view,
          bubbles: event.bubbles,
          cancelable: event.cancelable,
          screenX: event.screenX,
          screenY: event.screenY,
          clientX: event.clientX,
          clientY: event.clientY,
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
          altKey: event.altKey,
          metaKey: event.metaKey,
          button: event.button
        });

        below.dispatchEvent(ev);
      }
      this.$el.style.pointerEvents = "all";
    }
  }
});
</script>

<style scoped>
.invisible {
  fill: transparent;
  stroke: none;
  cursor: default;
}
.halfcircle{
  fill: var(--backgroundcolor);
}
</style>
