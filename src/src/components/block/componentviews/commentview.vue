<template>
  <g class="commentview">
      <foreignObject y="4" rx="20" ry="20" width="250" :height="ghostheight">
        <textarea @mousedown="$event.stopPropagation()" v-on:input="newValue($event)" v-bind:value="comment"/>
      </foreignObject>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import Block from "@/datastructures/block/block";
import { CommentComponent, ReturnComponent } from "@/datastructures/block/blockcomponents/blockcomponents";
import ProjectController from "@/datastructures/controllers/projectcontroller";


export default Vue.extend({
  props: {
    component: {
      type: CommentComponent,
      required: true
    },
    controller: {
      type: ProjectController,
      required: false
    }
  },
  data(){
    return{
      comment: "",
      ghostheight: "40px",
    }
  },
  mounted() {
    this.sendHeight(40);
    this.sendWidth(250);
    this.$emit("setPos", "base");

    this.comment = (this.component.getText());
    this.$nextTick(() => {
        this.$el.setAttribute('style', 'height:' + (this.$el.scrollHeight) + 'px;overflow-y:hidden;')
    });
    this.$el.addEventListener('input', this.resizeTextarea);

    
  },
  methods: {
    sendHeight: function(h: number) {
      this.$emit("heightUpdate", h);
    },
    sendWidth: function(w: number) {
      this.$emit("widthUpdate", w);
    },
    newValue(evt : Event){
      if(this.controller){
        this.component.setText(evt.target.value);
        this.comment = evt.target.value;
      } else
          evt.target.value = "";
    },
    resizeTextarea: function(evt: Event) {
        evt.target.style.height = 'auto';
        evt.target.style.height = (evt.target.scrollHeight) + 'px';
        this.ghostheight = (evt.target.scrollHeight) + 'px';
        this.sendHeight(evt.target.scrollHeight);
    },
  },
});
</script>
<style scoped>
textarea{
  border:none;
  border-radius: 15px;
  resize: none;
  padding: 2px;
  width: 90%;
  height: 90%;
}
</style>


