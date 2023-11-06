<template>
  <g class="inputview">
      <!-- If input is empty, make white block -->
      <foreignObject  v-if="_ghost" 
        class="invisibleInput"
        y="4" 
        rx="20" ry="20" 
        :width="ghostwidth" height="22" 
        @mouseup="mouseReleased()" 
      >
        <div>
          <input ref="inputsilhouette" v-on:input="updateGhostWidth();changing = true;" class="hoverInput" @mousedown="$event.stopPropagation()" v-on:blur="newValue()"  @mouseover="onHover" @mouseleave="deHover"/>
          <span ref="span"></span>
        </div>
      </foreignObject>

    <rect v-else-if="_noinput"
      class="invisibleInput hoverInput"
      ref="noinputsilhouette"
      y="4"
      rx="15"
      ry="15"
      :width="ghostwidth"
      height="22"
      style="fill: black;fill-opacity:0.4;"
      @mouseup="mouseReleased()"
      @mouseover="onHover"
      @mouseleave="deHover"
    ></rect>

      <!-- Else blockview + change width en height to block's width and height-->
      <g v-else @mousedown="detachBlock">
      <blockview v-on:heightUpdate="updateInput()" v-on:widthUpdate="updateInput()" v-bind:_block="_getblock" v-bind:_projectcontroller="controller" ref="input"></blockview>
      </g>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import Block from "@/datastructures/block/block";
import { InputComponent, ReturnComponent } from "@/datastructures/block/blockcomponents/blockcomponents";
import ProjectController from "@/datastructures/controllers/projectcontroller";
import { GhostBlock } from '@/datastructures/blocks/basicblocks/ghostblock';

export default Vue.extend({
  props: {
    component: {
      type: InputComponent,
      required: true
    },
    controller: {
      type: ProjectController,
      required: false
    }
  },
  computed: {
      _novalue(): boolean {
          return (this.component.getValue() == undefined);
      },
      _noinput(): boolean {
        return this.component.getBlock() == null;
      },
      _getblock(): Block | null {
        return this.component.getBlock();
      },
      _ghost(): boolean{
        return this.component.getBlock()?.getName() == "Ghost";
      }
  },
  data(){
    return{

      ghostwidth: "80px",
      changing: false
    }
  },
  mounted() {
    this.sendHeight(20);
    this.sendWidth(80);
    this.$emit("setPos", "base");
  },
  methods: {
    sendHeight: function(h: number) {
      this.$emit("heightUpdate", h);
    },
    sendWidth: function(w: number) {
      this.$emit("widthUpdate", w);
    },
    updateInput: function(){
      if (this.component.getBlock() == null || this.$refs.input == undefined) {
        this.sendHeight(20);
        this.sendWidth(80);
        return;
      }
      this.sendHeight(this.$refs.input.height);
      this.sendWidth(this.$refs.input.width);
    },

    // Checks if a block needs to be attached when mouse is released on the silhouette
    mouseReleased: function(){
      //Only valid when input can be put in
      if (this.controller != null && this.controller.getDragController().getSelectedBlock() != null){
          this.controller.getBlockController().inputBlock(this.controller.getDragController().getSelectedBlock(), this.component);
      }
    },

    // Checks if silhouette needs to be shown when hovered over
    onHover: function() {
      //Only show silhouette if a block can be inserted
      if (this.controller != null && this.controller.getDragController().getSelectedBlock() != null){

        //Only show silhouette if the holded block has a returncomponent
        if (this.controller.getDragController().getSelectedBlock().hasComponent("Return")) {

          //Only show silhouette if the holded block has the right returncomponent
          const wantedtype = "Return" + this.component.getCompType();
          if (this.component.getCompType() == "any" || this.controller.getDragController().getSelectedBlock().getComponent("Returnany") != null || this.controller.getDragController().getSelectedBlock().getComponent(wantedtype) != null){

            if (this.$refs.inputsilhouette){
              this.$refs.inputsilhouette.style.border="1px solid black";
            } else if (this.$refs.noinputsilhouette){
              this.$refs.noinputsilhouette.style.stroke="white";
            }
          }

        }

      }

    },

    // Hides silhouette again when not hovering over it
    deHover: function() {
      if (this.$refs.inputsilhouette){
        this.$refs.inputsilhouette.style.border="none";
      } else if (this.$refs.noinputsilhouette){
        this.$refs.noinputsilhouette.style.stroke="none";
      }
    },

    // Detaches a block from the inputview
    detachBlock: function(evt : any){
      if (this.controller != null){
        this.controller.getDragController().setClientPos([evt.clientX,evt.clientY]);
        const block = this.component.getBlock();
        const blockEl = document.getElementById("block" + block.getId());
        this.controller.getBlockController().removeInput(this.component, [
          evt.clientX - blockEl.getBoundingClientRect().left,
          evt.clientY - blockEl.getBoundingClientRect().top
        ]);
        /*this.controller.getBlockController().removeInput(this.component, [
          evt.clientX - evt.target.getBoundingClientRect().left,
          evt.clientY - evt.target.getBoundingClientRect().top
        ]);*/
        this.setTextFromGhost();
        evt.stopPropagation();
      }
    },

    // Ads a new value to the input
    newValue(){
      if (!this.changing) return;
      this.changing = false;
      if(this.controller){
        if (this.component.getBlock() != null && this.component.getBlock()?.getName() == "Ghost"){
          this.controller.getBlockController().writeText(this.component, this.$refs.inputsilhouette.value);
        }
        this.setTextFromGhost();

        this.updateGhostWidth();
      } else
          this.$refs.inputsilhouette.value = "";
    },

    updateGhostWidth: function(){
      const span = this.$refs.span as HTMLSpanElement;
      span.innerHTML = this.$refs.inputsilhouette.value;
      let l = span.getBoundingClientRect().width + 10;
      if (l < 80) l = 80;
      this.sendWidth(l);
      this.ghostwidth = l + "px";
    },

    setTextFromGhost(){
      const block = this.component.getBlock();
      if (block == undefined) return;

      if (block.getName() != "Ghost") return;
      let val = (block.getComponent("Returnstring") as ReturnComponent<
        string
      >).getValue();
      if (val == undefined) val = "";
      
      if (this.$refs.inputsilhouette != undefined)
      this.$refs.inputsilhouette.value = val;
      Vue.nextTick(() => {
        this.updateGhostWidth();
      });
  
    }
  },
  components: {
    blockview: () => import('../blockview')
  },
  watch:{
    component: {
      handler: function(newval) {
        this.$nextTick(() => {
          this.updateInput();
          this.setTextFromGhost();
        });
      },
      immediate: true,
      deep: true
    },
    controller: {
      handler: function(newval) {
        if (this.changing) this.newValue();
        this.setTextFromGhost();
      },
      immediate: true,
      deep: true
    },
  }
});
</script>
<style scoped>
input{
  border:none;
  border-radius: 15px;
  padding: 2px;
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 15px;
  margin-right: 10px;
}
span {
    white-space:pre;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 16px;
}
div{
  width: 96%;
}
</style>


