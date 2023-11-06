<template>
  <div id="blocklistContainer" @wheel="onScroll">
    <div class="header">
      Blokkenlijst
    </div>
    <svg id="blocklist" @mouseup="unSelectBlocklist" ref="blockList">
      <rect
        id="blocklistBackground"
        height="100%"
        width="100%"
      />
      <svg
        class="listcanvas"
        id="blockListSVG"
        width="285"
        v-bind:height="blocklistheight()"
      >
        <g
          id="blockListGroup"
          v-bind:transform="'translate(0,' + -scrollDist + ')'"
        >
          <Categorie
            ref="categories"
            v-for="(cat, i) in categories"
            :key="cat.Name"
            v-bind:name="cat.Name"
            v-bind:blocks="cat.Blocks"
            v-bind:color="cat.Color"
            x="0"
            v-bind:y="catY[i]"
            v-on:heightupdate="updateHeights"
            @selectedBlock="sendSelected"
          ></Categorie>
        </g>
        <Scrollbar
          v-bind:startX="blocklistwidth()"
          v-bind:startY="0"
          v-bind:maxX="0"
          v-bind:maxY="blocklistheight()"
          v-bind:speed="scrollSpeed()"
          ref="scrollYList"
          v-on:scrollUpdate="updateScroll"
        ></Scrollbar>
      </svg>
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Block from "@/datastructures/block/block";
import ProjectController from "@/datastructures/controllers/projectcontroller";
import ProjectVars from "@/datastructures/project/projectvars";
import Scrollbar from "../scrollbar.vue";
import Categorie from "./categorie.vue";
import Logger from "@/util/logger";

import { VarBlock, VarSetBlock } from "@/datastructures/blocks/valueblocks/valueblocks";
import {
  ImageMoveUpBlock,
  ImageMoveDownBlock,
  ImageMoveLeftBlock,
  ImageMoveRightBlock,
  ImageRotateBlock,
  ImageScaleUpBlock,
  ImageScaleDownBlock
} from "@/datastructures/blocks/imageblocks";

import { Categories } from "./categories";

import { ImageClickBlock } from '../../datastructures/blocks/blockclasses';

const MARGIN = 0;
const SCROLLSPEED = 60;
const BOTTOMMARGIN = 300;

export default Vue.extend({
  props: {
    projectController: {
      validator: function(prop) {
        return prop == null || prop instanceof ProjectController;
      },
      required: true
    }
  },
  data() {
    return {
      categories: [],
      buttonheights: [] as number[],
      catY: [] as number[],
      canvasY: 0,
      scrollDist: 0,
      scrolllock: false
    };
  },

  methods: {
    /**
     * calculates the height of all categories
     */
    catHeight(): number {
      // return 0 if not yet rendererd
      if (this.$refs.categories == undefined) return 0;

      // height of all categories is y pos of last cat + height of last cat
      return (
        this.catY[this.categories.length - 1] +
        this.$refs.categories[this.categories.length - 1].height + BOTTOMMARGIN
      );
    },

    /**
     * calculates the height of the blocklist
     */
    blocklistheight(): number {
      // return 0 if not yet rendered
      if (this.$el == undefined) return 0;

      return this.$refs.blockList.clientHeight;
    },

    /**
     * calculates the width of the blocklist
     */
    blocklistwidth(): number {
      // return 0 if not yet rendered
      if (this.$el == undefined) return 0;
      return this.$refs.blockList.clientWidth;
    },

    /**
     * calculates the scrollspeed of the scrollbar
     */
    scrollSpeed(): number {
      // speed is 0 if not visible
      if (this.hideScrollbar()) return 0;

      // scroll slower when list is longer
      const speed = SCROLLSPEED * (this.blocklistheight() / this.catHeight());
      if (speed < 0) return 0;
      return speed;
    },

    /**
     * true if scrollbar needs to be hidden
     */
    hideScrollbar(): boolean {
      // hide scrollbar if height of all categories is smaller
      return this.blocklistheight() > this.catHeight();
    },

    /**
     * update the Y positions of the categories
     */
    updateHeights() {
      // if not rendered, stop
      if (this.$refs.categories == undefined) return;

      let pos = MARGIN; // first position

      //For every category
      for (let i = 0; i < this.categories.length; ++i) {
        // set y pos of categorie
        this.$set(this.catY, i, pos);
        // add height of last categorie
        pos += MARGIN + this.$refs.categories[i].height;
      }

      //this.updateScroll(0, this.$refs.scrollYList.yPercent);

      // send new yPercent to scrollbar
      this.$refs.scrollYList.setPercentage(this.scrollDist / (this.catHeight() - this.blocklistheight()));
    },

    /**
     * send scroll events to scrollbar
     */
    onScroll(evt: MouseWheelEvent) {
      if (!this.scrolllock) this.$refs.scrollYList.onScroll(evt);
    },

    /**
     * Update the scroll position
     * @param yPercent scroll precentage
     */
    updateScroll(xPercent: number, yPercent: number) {
      if (this.hideScrollbar()) {
        this.scrollDist = 0;
        return;
      }
      this.scrollDist = yPercent * (this.catHeight() - this.blocklistheight());
    },

    /**
     * select a block
     */
    sendSelected(evt: any, block: Block) {
      this.unSelectBlocklist(); // unselect any blocks

      // create new block
      const b = block.createCopy();
      // set parameters of special blocks
      switch (b.getName()) {
        case "VarSet":
          (b as VarSetBlock).setProjectVars(this.projectController.getProject().getProjectVars());
          break;
        case "Var":
          (b as VarBlock).setVarName((block as VarBlock).getVarName());
          (b as VarBlock).setProjectVars(this.projectController.getProject().getProjectVars());
          break;
        case "ImageClickBlock":
          (b as ImageClickBlock).setProjectImgs(
            this.projectController.getProject().getProjectImgs()
          );
          break;
        case "ImageMoveUpBlock":
          (b as ImageMoveUpBlock).setProjectImgs(
            this.projectController.getProject().getProjectImgs()
          );
          break;
        case "ImageMoveDownBlock":
          (b as ImageMoveDownBlock).setProjectImgs(
            this.projectController.getProject().getProjectImgs()
          );
          break;
        case "ImageMoveLeftBlock":
          (b as ImageMoveLeftBlock).setProjectImgs(
            this.projectController.getProject().getProjectImgs()
          );
          break;
        case "ImageMoveRightBlock":
          (b as ImageMoveRightBlock).setProjectImgs(
            this.projectController.getProject().getProjectImgs()
          );
          break;
        case "ImageRotateBlock":
          (b as ImageRotateBlock).setProjectImgs(
            this.projectController.getProject().getProjectImgs()
          );
          break;
        case "ImageScaleUpBlock":
          (b as ImageScaleUpBlock).setProjectImgs(
            this.projectController.getProject().getProjectImgs()
          );
          break;
        case "ImageScaleDownBlock":
          (b as ImageScaleDownBlock).setProjectImgs(
            this.projectController.getProject().getProjectImgs()
          );
          break;
      }

      // select the block with certain offset
      const blockEl = document.getElementById("block" + block.getId());
      this.projectController.getBlockController().newBlock(b, [
        evt.clientX - blockEl.getBoundingClientRect().left,
        evt.clientY - blockEl.getBoundingClientRect().top
      ]);
      
      // update controller position
      this.projectController.getDragController().setClientPos([evt.clientX, evt.clientY]);
    },

    /**
     * returns the first blockview found by name
     * @returns the blockview of the block or undefined if not found
     */
    getBlockView(name: string) {
      // search all categories for the block
      for (let i = 0; i < this.$refs.categories.length; ++i) {
        const index = this.$refs.categories[i].getBlockIndex(name);

        // return if block found
        if (index != -1) return this.$refs.categories[i].getBlockView(index);
      }
      return undefined;
    },

    /**
     * Delete a selected block
     */
    unSelectBlocklist() {
      if (this.projectController.getDragController().getSelectedBlock() != null)
        this.projectController.getBlockController().deleteSelectedBlock();
    },

    /**
     * scroll until block with name is in the middle of the blocklist
     * @post the categorie of the block is open
     * @post block with name: blockname is in the middle of the blocklist
     */
    scrollToBlock(blockname: string): void {
      // check all categories
      for (let i = 0; i < this.$refs.categories.length; ++i) {
        const cat = this.$refs.categories[i];

        // check if categorie has the block
        const index = cat.getBlockIndex(blockname);
        if (index == -1) continue; // continue searching if not found

        // open categorie
        if (!cat.isOpen()) cat.changeOpened();

        const blockview = cat.getBlockView(index);

        // scroll blockview to middle of the blocklist
        this.$refs.scrollYList.setPercentage(blockview.y / this.catHeight());

        return;
      }
    },
    scrollLock(state: boolean) {
      this.scrolllock = state;
    }
  },
  mounted() {
    // add eventlisteners
    window.addEventListener("resize", this.updateHeights);

    // add categories Y positions
    for (let i = 0; i < Categories.length; ++i) {
      this.catY.push(0);
    }
    this.categories = Categories; // set categories

    // update heights when categories are rendered and open first categorie
    this.$nextTick(() => {
      this.updateHeights();

      if (this.categories.length > 0) this.$refs.categories[0].changeOpened();
    });
  },
  components: {
    Scrollbar,
    Categorie
  }
});
</script>

<style scoped>
#blocklistContainer {
  width: fit-content;
  height: 100%;
  /*margin-top: 5px;*/
  /* display: inline-block; */
  /* margin-bottom: 5px; */
}
#blocklist {
  border-right: 1px solid black;
  width: 280px;
  height: calc(100% - 26px);
  overflow: auto;
  /* float: left; */
}
#blocklistBackground {
  color: transparent;
  width: inherit;
  height: 100%;
  /*height: inherit;*/
  fill: var(--backgroundcolor);
}

.header {
  color: white;
  background-color: var(--ioheadercolor);
  height: 20px;
  padding: 3px;
  border: 1px solid black;
}
</style>
