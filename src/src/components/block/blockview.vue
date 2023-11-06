<template>
  <g
    class="blockview"
    v-bind:transform="transform"
    @mousedown="sendSelected($event, _block)"
    @mouseup="blockReleased($event, _block)"
    v-bind:class="_block.isActive() ? 'active' : 'notactive'"
    v-bind:id="'block' + _block.getId()"
  >
    <rect
      v-bind:width="basewidth"
      v-bind:height="baseheight"
      v-bind:fill="_block.getColor()"
      v-bind:y="topheight"
      rx="10" ry="10"
    />
    <componentview
      v-for="(data, index) in componentdata"
      :key="index"
      v-bind:componentdata="data"
      v-bind:_projectcontroller="_projectcontroller"
      v-on:dataUpdate="dataUpdate(index, $event)"
    ></componentview>
  </g>
</template>

<script lang="ts">
import Vue from "vue";
import Block from "@/datastructures/block/block";
import componentview, {
  ComponentViewData
} from "./componentviews/componentview.vue";
import ProjectController from "@/datastructures/controllers/projectcontroller";
import { Observer } from "@/util/observer";

const BASEMARGIN = 20;

export default Vue.extend({
  props: {
    _block: {
      type: Block,
      required: true
    },
    x: {
      default: 0
    },
    y: {
      default: 0
    },
    _projectcontroller: {
      class: ProjectController,
      required: false
    }
  },

  computed: {
    transform(): string {
      return "translate(" + this.x.toString() + "," + this.y.toString() + ")";
    },
    /**
     * width of the block
     */
    width(): number {
      return this.basewidth;
    },
    /**
     * height of the block
     */
    height(): number {
      return this.topheight + this.baseheight + this.bottomheight;
    }
  },
  mounted() {
    // create componentdata for every component in the block
    for (let i = 0; i < this._block.nComponents(); ++i) {
      const c = this._block.getNComponent(i);
      this.componentdata.push({
        component: c,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        pos: ""
      });
    }
  },
  data() {
    return {
      componentdata: [] as ComponentViewData[],
      basewidth: BASEMARGIN as number,
      topheight: 0 as number,
      baseheight: BASEMARGIN as number,
      bottomheight: 0 as number
    };
  },
  methods: {
    /**
     * Update the component data of a component
     * @param index component nummer (first = 0)
     * @param data new component data
     * @post componentdata is changed to new data
     * @post position of component is updated
     */
    dataUpdate(index: number, data: ComponentViewData) {
      this.componentdata[index] = data;
      this.updatePos(index);
    },

    /**
     * Update the position of a component
     * @param index component nummer (first = 0)
     */
    updatePos(index: number) {
      // update the place component is in
      switch (this.componentdata[index].pos) {
        case "base":
          return this.updateBase();
        case "top":
          return this.updateTop();
        case "bottom":
          return this.updateBottom();
        default:
          return;
      }
    },
    /**
     * update the position of base components
     */
    updateBase() {
      let xpos = 20;
      let ypos = BASEMARGIN / 2 + this.topheight;
      let ymax = 0;
      let xmax = 0;
      for (let i = 0; i < this.componentdata.length; ++i) {
        const data = this.componentdata[i];

        // go to new line if a break component
        if (data.component.getName() == "Break") {
          ypos += ymax + BASEMARGIN / 2;
          if (xpos > xmax) xmax = xpos;
          xpos = BASEMARGIN;
        }

        if (data.pos == "base") {
          // update the new position of the base component
          data.x = xpos;
          data.y = ypos;

          // calculate new position of next base component
          xpos += data.w + 15;
          if (ymax < data.h) ymax = data.h;
        }
      }

      // update baseheight and width
      const oldwidth = this.basewidth;
      this.basewidth = (xmax > xpos ? xmax : xpos);
      const oldheight = this.baseheight;
      this.baseheight = ypos - this.topheight + ymax + BASEMARGIN/2;

      // update width if updated
      if (oldwidth != this.basewidth) this.widthUpdate();
      // update bottom position if height updated
      if (oldheight != this.baseheight) this.updateBottom();
    },
    /**
     * update the position of top components
     */
    updateTop() {
      let ypos = 0;
      for (let i = this.componentdata.length - 1; i >= 0; --i) {
        const data = this.componentdata[i];
        if (data.pos == "top") {
          // update position of top component
          data.y = ypos;
          data.x = 0;

          // caluculate position of next top component
          ypos += data.h;
        }
      }

      // update top height
      const oldheight = this.bottomheight;
      this.topheight = ypos;

      // send heightupdate if height changed
      if (oldheight != this.baseheight) this.heightUpdate();
    },
    /**
     * update the position of bottom components
     */
    updateBottom() {
      let ypos = this.topheight + this.baseheight;
      for (let i = 0; i < this.componentdata.length; ++i) {
        const data = this.componentdata[i];
        if (data.pos == "bottom") {
          // update position of bottom component
          data.y = ypos;
          data.x = 0;

          // calculate next position of bottom component
          ypos += data.h;
        }
      }

      // update nottom height
      const oldheight = this.bottomheight;
      this.bottomheight = ypos - this.baseheight;

      // send heightupdate if height changed
      if (oldheight != this.baseheight) this.heightUpdate();
    },

    /**
     * send heightupdate to parent component
     */
    heightUpdate() {
      this.$emit("heightUpdate", this.height);
    },
    /**
     * send widthupdate to parent component
     */
    widthUpdate() {
      this.$emit("widthUpdate", this.width);
    },
    /**
     * notify parent component that the block is clicked
     */
    sendSelected(evt: any, block: Block) {
      this.$emit("selectedBlock", evt, block);
    },
    /**
     * notify parent component that the block is released
     */
    blockReleased(evt: any, block: Block) {
      this.$emit("blockReleased", evt, block);
    }
  },

  components: {
    componentview
  }
});
</script>

<style scoped>
:hover{
  cursor: grab;
}
.active{
  stroke: yellow;
}
.notactive{
  stroke: none;
}
</style>