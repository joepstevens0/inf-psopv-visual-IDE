<template>
  <div id="canvasContainer" width="100%" @wheel="onScroll">
    <div class="header">
      Canvas
    </div>

    <svg id="canvas" width="100%" ref="canvas">
      <g id="canvasMain" @mouseup="unSelect">
        <rect
          height="100%"
          width="100%"
          class="CanvasBackground"
          @mousedown="selectCanvas($event)"
        />
        <g
          id="canvasBlocks"
          v-bind:transform="'translate(' + canvasX + ',' + canvasY + ')'"
        >
          <rect
            id="realcanvas"
            :x="0"
            :y="0"
            :width="realcanvasWidth"
            :height="realcanvasHeight"
            fill="none"
          />
          <blockview
            v-for="index in project.nBlocks()"
            :key="project.getBlock(index - 1).getId()"
            v-bind:_block="project.getBlock(index - 1)"
            v-bind:_projectcontroller="projectController"
            :x="project.getBlockX(index - 1)"
            :y="project.getBlockY(index - 1)"
            @selectedBlock="selectBlock($event, index - 1)"
          ></blockview>
        </g>
      </g>

      <errorpopup
        v-bind:projectcontroller="projectController">
      </errorpopup>
      <erroroverview 
        v-bind:projectcontroller="projectController" 
        v-bind:canvasWidth="canvasWidth">
      </erroroverview>
      <overview
        class="overview"
        v-bind:project="project"
        v-bind:canvasdata="canvasdata"
        ref="overview"
      ></overview>
      <Scrollbar
        v-bind:startX="canvasWidth"
        v-bind:startY="0"
        v-bind:maxX="0"
        v-bind:maxY="canvasHeight"
        v-bind:speed="30"
        v-on:scrollUpdate="scrollY"
        ref="scrollY"
      ></Scrollbar>
      <Scrollbar
        v-bind:startX="0"
        v-bind:startY="canvasHeight"
        v-bind:maxX="canvasWidth"
        v-bind:maxY="0"
        v-bind:speed="30"
        v-on:scrollUpdate="scrollX"
        ref="scrollX"
      ></Scrollbar>
    </svg>

    <functionpopup
      v-bind:project="project"
      v-bind:projectcontroller="projectController">
    </functionpopup>>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Scrollbar from "../scrollbar.vue";
import Block from "@/datastructures/block/block";
import blockview from "../block/blockview.vue";
import Project from "@/datastructures/project/project";
import ProjectController from "@/datastructures/controllers/projectcontroller";
import overview from "./overview.vue";
import erroroverview from "./erroroverview.vue";
import errorpopup from "./errorpopup.vue";
import functionpopup from "./functionpopup.vue";

import ErrorController from '../../datastructures/controllers/errorcontroller';

export default Vue.extend({
  components: {
    Scrollbar,
    blockview,
    overview,
    erroroverview,
    errorpopup,
    functionpopup
  },
  props: {
    project: {
      type: Project,
      required: true
    },
    projectController: {
      validator: function(prop) {
        return prop == null || prop instanceof ProjectController;
      },
      required: true
    }
  },
  data() {
    return {
      dragging: false,
      canvasX: 0,
      canvasY: 0,
      canvasWidth: 0,
      canvasHeight: 0,
      maxX: 1000,
      maxY: 1000,
      scrolllock: false
    };
  },
  computed: {
    /**
     * all canvas size data in an array
     */
    canvasdata(): [any, any, any, any, any, any, any, any] {
      return [
        this.maxX,
        this.maxY,
        this.realcanvasWidth,
        this.realcanvasHeight,
        this.canvasWidth,
        this.canvasHeight,
        this.canvasX,
        this.canvasY
      ];
    },

    /**
     * Width of the total canvas
     */
    realcanvasWidth(): number {
      return 2 * this.maxX + this.canvasWidth;
    },

    /**
     * Height of the total canvas
     */
    realcanvasHeight(): number {
      return 2 * this.maxY + this.canvasHeight;
    },
  },
  mounted() {
    setTimeout(this.updateSize, 100);
    // add eventlisteners
    window.addEventListener("resize", this.updateSize);
    window.addEventListener("mousemove", this.moveObject);
    window.addEventListener("mouseup", this.stopDrag);

    // update size when al is rendered
    this.$nextTick(this.updateSize);
  },
  methods: {
    /**
     * Start dragging of canvas
     */
    selectCanvas(event: any) {
      this.dragging = true;
    },

    /**
     * Stop dragging of canvas
     */
    stopDrag() {
      this.dragging = false;
    },

    /**
     * Select a block from the canvas
     * @post block is removed from canvas and selected
     */
    selectBlock(event: any, index: number) {
      // if already a selected block, stop
      if (this.projectController.getDragController().getSelectedBlock() != null) return;

      // update client position
      this.projectController.getDragController().setClientPos([event.clientX, event.clientY]);

      const block = document.getElementById("block" + this.project.getBlock(index).getId());

      // remove block from canvas
      this.projectController.getBlockController().removeBlock(this.project.getBlock(index), [
        event.clientX - block.getBoundingClientRect().left,
        event.clientY - block.getBoundingClientRect().top
      ]);

      // notify parent components
      this.$emit("selectedGlobalBlock", event);
    },

    /**
     * Place selected block on the canvas
     */
    unSelect(evt: any) {
      const selectedBlock = this.projectController.getDragController().getSelectedBlock();
      if (selectedBlock) {
        //place block on canvas
        const canvasObject = document.getElementById("canvas");
        if (canvasObject) {
          const canvasPos = canvasObject.getBoundingClientRect();
          //no offset
          const xPos =
            evt.clientX -
            canvasPos.left -
            this.canvasX -
            this.projectController.getDragController().getSelectedOffset()[0];
          const yPos =
            evt.clientY -
            canvasPos.top -
            this.canvasY -
            this.projectController.getDragController().getSelectedOffset()[1];

          this.projectController.getBlockController().addBlock(selectedBlock, xPos, yPos);
        }
      }

      this.updateOverView();
    },

    /**
     * Move canvas when dragging on mousemove event
     */
    moveObject(event: MouseEvent) {
      if (this.dragging && !this.scrolllock) {
        const mult = this.canvasHeight / this.realcanvasHeight;
        // move scrollbars
        this.$refs.scrollX.moveBar(mult * -event.movementX, 0);
        this.$refs.scrollY.moveBar(0, mult * -event.movementY);
      }
    },

    /**
     * send scroll event to vertical scrollbar
     */
    onScroll(evt: MouseWheelEvent) {
      if (!this.scrolllock) this.$refs.scrollY.onScroll(evt);
    },

    /**
     * Update scroll y position
     * @param yPercent new scroll percentage
     */
    scrollY(xPercent: number, yPercent: number) {
      this.canvasY = (this.realcanvasHeight - this.canvasHeight) * -yPercent;
      this.updateOverView();
    },

    /**
     * Update scroll x postion
     * @param xPercent new scroll percentage
     */
    scrollX(xPercent: number, yPercent: number) {
      this.canvasX = (this.realcanvasWidth - this.canvasWidth) * -xPercent;
      this.updateOverView();
    },

    /**
     * update canvasheight and -width
     */
    updateSize() {
      this.canvasWidth = this.$refs.canvas.clientWidth;
      this.canvasHeight = this.$refs.canvas.clientHeight;
      //Update overview
      this.updateOverView();
    },

    /**
     * Update overview
     */
    updateOverView() {
      this.$refs.overview.updateOverview([
        this.maxX,
        this.maxY,
        this.realcanvasWidth,
        this.realcanvasHeight,
        this.canvasWidth,
        this.canvasHeight,
        this.canvasX,
        this.canvasY
      ]);
    },
    scrollLock(state: boolean) {
      this.scrolllock = state;
    }
  },
  beforeDestroy: function() {
    // remove event listeners
    window.removeEventListener("resize", this.updateSize);
    window.removeEventListener("mousemove", this.moveObject);
    window.removeEventListener("mouseup", this.stopDrag);
  },
  updated() {
    this.updateSize();
  }
});
</script>

<style scoped>
#canvasContainer {
  min-width: 500px;
  width: 100%;
  height: 100%;
  /*margin-top: 5px;*/
}
.CanvasBackground {
  fill: var(--backgroundcolor);
}
#canvas {
  height: calc(100% - 26px);
  border: none;
  overflow: hidden;
  stroke: black;
}

.overview {
  float: right;
}

.header {
  color: white;
  background-color: var(--ioheadercolor);
  height: 20px;
  padding: 3px;
  border: 1px solid black;
}
</style>
