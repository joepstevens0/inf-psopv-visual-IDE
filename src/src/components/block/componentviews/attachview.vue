<template>
  <g class="attachview">
    <!-- Make invisible field where new blocks can be placed if there is no next block attached yet-->
    <rect v-if=_notattached 
      class="invisible invisibleAttach" 
      ref="attachsilhouette" 
      x="0" 
      rx="10" ry="10" 
      width="65" height="40" 
      @mouseup="mouseReleased" 
      @mouseover="onHover"
      @mouseleave="deHover"
      @mousedown="mousedown"
      />

    <!-- Else make blockview of attached block -->
    <g v-else @mousedown="detachBlock">
      <blockview 
        x="0" 
        v-on:heightUpdate="updateHeight()" 
        v-bind:_block="_getblock" 
        v-bind:_projectcontroller="controller" 
        ref="attached">
      </blockview>
    </g>

    <!-- Create half circle <circle cx="40" r="15" :fill="_color"/>-->
    <path d="M15,-1 a1,1 0 0,0 30,0" :fill="_color" />
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import Block from "@/datastructures/block/block";
import blockview from "../blockview.vue";
import { AttachComponent } from "@/datastructures/block/blockcomponents/blockcomponents";
import ProjectController from "@/datastructures/controllers/projectcontroller";

export default Vue.extend({
  props: {
    component: {
      type: AttachComponent,
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
    },

    _notattached(): boolean {
      return (this.component.getNext() == null)
    },

    //Ignore null, already checked by _notattached
    _getblock(): Block | null{
      return this.component.getNext();
    }
  },
  mounted() {
    this.sendHeight(10);
    this.sendWidth(10);
    this.$emit("setPos", "bottom");
  },
  methods: {
    sendHeight: function(h: number) {
      this.$emit("heightUpdate", h);
    },
    sendWidth: function(w: number) {
      this.$emit("widthUpdate", w);
    },
    updateHeight: function(){
      this.$emit("heightUpdate", this.$refs.attached.height);
    },

    // Checks if a block needs to be attached when mouse is released on the silhouette
    mouseReleased: function(){
      if (this.controller != null && this.controller.getDragController().getSelectedBlock() != null){
        //Only attach the block if it can be attached
        if (this.controller.getDragController().getSelectedBlock().hasComponent("Connect")){
          this.controller.getBlockController().attachBlock(this.controller.getDragController().getSelectedBlock(), this.component);
        }
      }
    },

    // Checks if silhouette needs to be shown when hovered over
    onHover: function() {
      //Only show silhouette if a block can be attached
      if (this.controller != null && this.controller.getDragController().getSelectedBlock() != null){
        //Only show silhouette if the holded block can be attached
        if (this.controller.getDragController().getSelectedBlock().hasComponent("Connect")){
          this.$refs.attachsilhouette.style.stroke="black";
        }
      }
    },

    // Hides silhouette again when not hovering over it
    deHover: function() {
      if (this.$refs.attachsilhouette){
        this.$refs.attachsilhouette.style.stroke="none";
      }
    },

    // Detaches a block from the attachview
    detachBlock: function(evt : any){
      if (this.controller != null){
        this.controller.getDragController().setClientPos([evt.clientX,evt.clientY]);
        const block = this.component.getNext();
        const blockEl = document.getElementById("block" + block.getId());
        this.controller.getBlockController().detachBlock(this.component, [
          evt.clientX - blockEl.getBoundingClientRect().left,
          evt.clientY - blockEl.getBoundingClientRect().top
        ]);
        this.sendHeight(45);
        evt.stopPropagation();
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
  },
  components: {
    blockview: () => import('../blockview')
  }
});
</script>

<style scoped>
.invisible{
  fill: transparent;
  stroke: none;
  cursor: default;
}
</style>
