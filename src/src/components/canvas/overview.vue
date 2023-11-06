<template>
  <g class="overview">
    Overview
    <svg x="80%" width="20%" height="20%">
      <rect
        class="minicanvas"
        width="100%"
        height="100%"
        rx="10"
        ry="10"
      ></rect>
      <rect
        class="miniviewbox"
        :x="miniviewboxX"
        :y="miniviewboxY"
        :width="miniviewboxWidth"
        :height="miniviewboxHeight"
        rx="10"
        ry="10"
      ></rect>
      <svg
        :viewBox="viewbox"
        v-for="(block, j) in miniblocks"
        :key="block[0].getId()"
        :x="getMiniblockX(j)"
        :y="getMiniblockY(j)"
      >
        <blockview
          class="miniblock"
          style="cursor: default;"
          v-bind:_block="block[0]"
        ></blockview>
      </svg>
    </svg>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import Project from "@/datastructures/project/project";
import Block from "@/datastructures/block/block";
import blockview from "../block/blockview.vue";

export default Vue.extend({
  props: {
    project: {
      type: Project,
      required: true
    }
  },
  data() {
    return {
      realmaxX: 0,
      realmaxY: 0,
      realcanvasWidth: 0,
      realcanvasHeight: 0,

      realviewboxWidth: 0,
      realviewboxHeight: 0,
      realviewboxX: 0,
      realviewboxY: 0,

      miniviewboxX: "0",
      miniviewboxY: "0",
      miniviewboxWidth: "0%",
      miniviewboxHeight: "0%"
    };
  },
  computed: {
    miniblocks(): [Block, number, number][] {
      return this.project.getBlocks();
    },
    viewbox(): string {
      return "0 0" + " " + this.realcanvasWidth + " " + this.realcanvasHeight;
    }
  },
  methods: {
    updateOverview(canvasdata: number[]) {
      //Update data
      this.updateRealCanvasData(canvasdata);

      //Update miniviewbox
      this.updateMiniViewboxData();

      //For every block
      //Blocks get automaticaly updated via project
    },

    updateRealCanvasData(canvasdata: number[]) {
      //[maxX, maxY, realcanvasWidth, realcanvasHeight, canvasWidth, canvasHeight, canvasX, canvasY]
      this.realmaxX = canvasdata[0];
      this.realmaxY = canvasdata[1];
      this.realcanvasWidth = canvasdata[2];
      this.realcanvasHeight = canvasdata[3];
      this.realviewboxWidth = canvasdata[4];
      this.realviewboxHeight = canvasdata[5];
      this.realviewboxX = canvasdata[6];
      this.realviewboxY = canvasdata[7];
    },

    updateMiniViewboxData() {
      //Calculate percentage of viewbox to canvas
      const miniwidth = (100 / this.realcanvasWidth) * this.realviewboxWidth;
      const miniheight = (100 / this.realcanvasHeight) * this.realviewboxHeight;
      this.miniviewboxWidth = miniwidth + "%";
      this.miniviewboxHeight = miniheight + "%";

      //Calculate position of viewbox
      const pixperprocwidth = this.realcanvasWidth / 100;
      const pixperprocheight = this.realcanvasHeight / 100;

      this.miniviewboxX = -this.realviewboxX / pixperprocwidth + "%";
      this.miniviewboxY = -this.realviewboxY / pixperprocheight + "%";
    },

    getMiniblockX(index: number) {
      const pixperprocwidth = this.realcanvasWidth / 100;
      return this.project.getBlockX(index) / pixperprocwidth + "%";
    },

    getMiniblockY(index: number) {
      const pixperprocheight = this.realcanvasHeight / 100;
      return this.project.getBlockY(index) / pixperprocheight + "%";
    }
  },
  components: {
    blockview
  }
});
</script>

<style scoped>
.overview {
  margin: 5px;
  width: 20%;
  height: 20%;
  /* height: 100%; */
  /* float: left; */
  pointer-events: none;
  background-color: var(--backgroundcolor);
}
.minicanvas {
  stroke: black;
  stroke-width: 1px;
  fill: var(--backgroundcolor);
}
.miniviewbox {
  stroke: black;
  stroke-width: 1px;
  fill: none;
}
</style>
