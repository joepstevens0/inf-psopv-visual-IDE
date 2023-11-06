<template>
  <g class="categorie">
    <!-- Open/close button -->
    <foreignObject
      width="100%"
      v-bind:height="BUTTONHEIGHT"
      :y="y"
      :x="x"
      v-on:click="changeOpened()"
    >
      <button class="category-button">
        <!-- Preview of the category's color -->
        <div style="display: inline-block;">
          <svg width="15px" height="15px">
            <rect width="15px" height="15px" :fill="color"></rect>
          </svg>
        </div>
        <!-- Category's name -->
        {{ name }}
        <!-- Icon showing if category is opened or not -->
        <span
          v-if="open == true"
          class="category-icon"
          id="category-open"
        ></span>
        <span v-else class="category-icon"></span>
      </button>
    </foreignObject>

    <!-- If category is opened, draw all blocks in category -->
    <g v-show="open == true">
      <blockview
        v-for="(block, i) in blocks"
        :key="block.getId()"
        v-bind:_block="block"
        v-bind:x="x + 20"
        v-bind:y="blockY[i]"
        ref="views"
        v-on:heightUpdate="heightUpdate"
        @selectedBlock="sendSelected"
      >
      </blockview>
    </g>
  </g>
</template>

<script lang="ts">
import Vue from "vue";

import blockview from "../block/blockview.vue";

import Block from "@/datastructures/block/block";

const BUTTONHEIGHT = 50;
const MARGIN = 15;

export default Vue.extend({
  props: {
    x: {
      default: 0
    },
    y: {
      default: 0
    },
    blocks: {
      required: true
    },
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      open: false as boolean,
      BUTTONHEIGHT: BUTTONHEIGHT,
      blockY: [] as number[]
    };
  },
  computed: {
    /**
     * height of categorie
     */
    height(): number {
      let height = BUTTONHEIGHT;

      // return if closed
      if (!this.open) return height;

      // add height off every block
      for (const ref of this.$refs.views) {
        height += ref.height + MARGIN;
      }
      return height;
    }
  },
  mounted() {
    // add block y position parameter for every block
    for (let i = 0; i < this.blocks.length; ++i) {
      this.blockY.push(this.y);
    }
    this.updateBlockPos();
  },
  methods: {
    /**
     * Returns true if categorie is open
     */
    isOpen(): boolean {
      return this.open;
    },

    /**
     * if closed, open the categorie. if open, close the categorie
     */
    changeOpened() {
      this.open = !this.open;
      this.heightUpdate();
    },

    /**
     * resend 'sendSelected' signal to parent component
     */
    sendSelected(evt: any, block: Block) {
      this.$emit("selectedBlock", evt, block);
    },

    /**
     * Notify parentcomponent on height update
     */
    heightUpdate() {
      this.updateBlockPos();
      this.$emit("heightupdate");
    },

    /**
     * update blocks y positions
     */
    updateBlockPos() {
      let pos = this.y + BUTTONHEIGHT;
      for (let i = 0; i < this.blocks.length; ++i) {
        this.$set(this.blockY, i, pos);

        pos += this.$refs.views[i].height + MARGIN;
      }
    },

    /**
     * Return the index of a block by name
     * @returns index of block with name or -1 if not found
     */
    getBlockIndex(name: string): number {
      for (let i = 0; i < this.blocks.length; ++i) {
        if ((this.blocks[i] as Block).getName() == name) return i;
      }
      return -1;
    },
    /**
     * get the blockview by index
     * @returns blockview with the given index
     */
    getBlockView(index: number){
      return this.$refs.views[index];
    }
  },
  components: {
    blockview
  },
  watch: {
    y: {
      handler(newval: number, oldval: number) {
        this.updateBlockPos();
      }
    }
  }
});
</script>

<style scoped>
.category-button {
  padding: 6px 8px 6px 16px;
  font-size: 20px;
  display: inline-block;
  border: 1px solid black;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  outline: none;
  z-index: -1;
}
.category-button:hover {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
.category-icon {
  background: url("../../assets/img/category-icon.png") no-repeat;
  background-size: 20px 20px;
  height: 20px;
  width: 20px;
  float: right;
  padding-right: 20px;
  display: inline-block;
}
#category-open {
  transform: rotateX(180deg);
}
</style>
