<template>
  <g class="apiattachview">
    <!-- Make invisible field where new blocks can be placed if there is no next block attached yet-->
    <rect v-if=_notattached 
      class="invisible invisibleAPIAttach" 
      ref="apiattachsilhouette" 
      x="0" 
      rx="10" ry="10" 
      width="65" height="40" 
      @mouseup="mouseReleased" 
      @mouseover="onHover"
      @mouseleave="deHover"
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

    <!-- Create triangle instead of circle -->
    <path d="M 30 14 L 15 -1 L 45 -1 z" :fill="_color" />
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import Block from "@/datastructures/block/block";
import blockview from "../blockview.vue";
import { APIAttachComponent } from "@/datastructures/block/blockcomponents/blockcomponents";
import ProjectController from "@/datastructures/controllers/projectcontroller";

export default Vue.extend({
  props: {
    component: {
      type: APIAttachComponent,
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
    this.sendHeight(40+5);
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
        if (this.controller.getDragController().getSelectedBlock().hasComponent("APIConnect")){
          this.controller.getBlockController().attachBlock(this.controller.getDragController().getSelectedBlock(), this.component);
        }
      }
    },

    // Checks if silhouette needs to be shown when hovered over
    onHover: function() {
      //Only show silhouette if a block can be attached
      if (this.controller != null && this.controller.getDragController().getSelectedBlock() != null){
        //Only show silhouette if the holded block can be attached
        if (this.controller.getDragController().getSelectedBlock().hasComponent("APIConnect")){
          this.$refs.apiattachsilhouette.style.stroke="black";
        }
      }
    },

    // Hides silhouette again when not hovering over it
    deHover: function() {
      if (this.$refs.apiattachsilhouette){
        this.$refs.apiattachsilhouette.style.stroke="none";
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
        /*this.controller.getBlockController().detachBlock(this.component, [
          evt.clientX - evt.target.getBoundingClientRect().left,
          evt.clientY - evt.target.getBoundingClientRect().top
        ]);*/
        this.sendHeight(45);
        evt.stopPropagation();
      }
    },
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
}
</style>
