<template>
  <g class="apienclosureview">
    <!-- Make a rectangle to the left with height based on blocks on the inside -->
    <rect y="-20" rx="10" ry="10" width="10" :height="this.encloseheight+30" :fill="_color"/>

    <!-- If there are no blocks, make invisible field. -->
    <rect 
      v-if=_notattached 
      class="invisible invisibleAPIAttach" 
      ref="apienclosesilhouette" 
      x="10" 
      rx="10" ry="10" 
      width="65" height="40" 
      @mouseup="mouseReleased()" 
      @mouseover="onHover" 
      @mouseleave="deHover"
    />

    <!-- Else build blockview of blocks -->
    <g v-else @mousedown="detachBlock">
      <blockview 
        v-on:heightUpdate="updateHeight()" 
        x="10" 
        v-bind:_block="_getblock" 
        v-bind:_projectcontroller="controller" 
        ref="enclosed">
      </blockview>
    </g>

    <!-- Create triangle instead of circle -->
    <path d="M 40 14 L 25 -1 L 55 -1 z" :fill="_color" />

    <!-- Make a rectangle at the bottom -->
    <rect :y="this.encloseheight-5" rx="10" ry="10" width="70" height="15" :fill="_color"/>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import Block from "@/datastructures/block/block"
import { APIEnclosureComponent } from "@/datastructures/block/blockcomponents/blockcomponents";
import ProjectController from "@/datastructures/controllers/projectcontroller";


export default Vue.extend({
  props: {
    component: {
      type: APIEnclosureComponent,
      required: true
    },
    controller: {
      type: ProjectController,
      required: false
    }
  },
  data() {
    return {
      encloseheight: 40,
    }
  },
  computed: {
    _color(): string {
      return this.component.getColor();
    },
    _notattached(): boolean {
      return (this.component.getFirstBlock() == null);
    },
    _getblock(): Block | null {
      return this.component.getFirstBlock();
    },
  },
  mounted() {
    this.sendHeight(40+10);
    this.sendWidth(75);
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
      this.$emit("heightUpdate", this.$refs.enclosed.height+10);
      this.encloseheight = this.$refs.enclosed.height;
    },

    // Checks if a block needs to be enclosed when mouse is released on the silhouette
    mouseReleased: function(){
      if (this.controller != null && this.controller.getDragController().getSelectedBlock() != null){
        //Only attach the block if it can be enclosed
        if (this.controller.getDragController().getSelectedBlock().hasComponent("APIConnect")){
          this.controller.getBlockController().encloseBlock(this.controller.getDragController().getSelectedBlock(), this.component);
        }
      }
    },

    // Checks if silhouette needs to be shown when hovered over
    onHover: function() {
      //Only show silhouette if a block can be enclosed
      if (this.controller != null && this.controller.getDragController().getSelectedBlock() != null){
        //Only show silhouette if the holded block can be enclosed
        if (this.controller.getDragController().getSelectedBlock().hasComponent("APIConnect")){
          this.$refs.apienclosesilhouette.style.stroke="black";
        }
      }
    },

    // Hides silhouette again when not hovering over it
    deHover: function() {
      if (this.$refs.apienclosesilhouette){
        this.$refs.apienclosesilhouette.style.stroke="none";
      }
    },

    // Detaches a block from the apienclosureview
    detachBlock: function(evt : any){
      if (this.controller != null){
        this.controller.getDragController().setClientPos([evt.clientX,evt.clientY]);
        const block = this.component.getFirstBlock();
        const blockEl = document.getElementById("block" + block.getId());
        this.controller.getBlockController().detachEnclosedBlock(this.component, [
          evt.clientX - blockEl.getBoundingClientRect().left,
          evt.clientY - blockEl.getBoundingClientRect().top
        ]);
        /*this.controller.getBlockController().detachEnclosedBlock(this.component, [
          evt.clientX - evt.target.getBoundingClientRect().left,
          evt.clientY - evt.target.getBoundingClientRect().top
        ]);*/
        this.encloseheight = 40;
        this.sendHeight(50);
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
