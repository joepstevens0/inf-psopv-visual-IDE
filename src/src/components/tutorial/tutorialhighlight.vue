<template>
  <div v-if="tutController.started() && !tutController.finished()">
    <div class="dim" v-bind:style="topDimStyle"></div>
    <div class="dim" v-bind:style="rightDimStyle"></div>
    <div class="dim" v-bind:style="bottomDimStyle"></div>
    <div class="dim" v-bind:style="leftDimStyle"></div>
    <div class="hiborder" v-bind:style="borderstyle"></div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

const MARGIN = 4;
const HIGHLIGHTBORDERWIDTH = 3;

import TutorialController from "@/datastructures/controllers/tutorialcontroller";
import Logger from '@/util/logger';

export default Vue.extend({
  props: {
    canvas: {
      required: true
    },
    blocklist: {
      required: true
    },
    tutController: {
      type: TutorialController,
      required: true
    }
  },
  data() {
    return {
      hiborder: new DOMRect(0, 0, 0, 0) as DOMRect,
      highlighted: null as HTMLElement | null
    };
  },
  computed: {
    /**
     * style of the top dim element
     */
    topDimStyle(): string {
      return (
        "top:0;height:" +
        (this.hiborder.y - MARGIN > 40 ? this.hiborder.y - MARGIN : 40) +
        "px;width:100%"
      );
    },
    /**
     * style of the right dim element
     */
    rightDimStyle(): string {
      return (
        "right:0;left:" +
        (this.hiborder.x + this.hiborder.width + MARGIN) +
        "px;top:" +
        (this.hiborder.y - MARGIN > 0 ? this.hiborder.y - MARGIN : 0) +
        "px;height:" +
        (this.hiborder.height + MARGIN + MARGIN) +
        "px"
      );
    },
    /**
     * style of the bottom dim element
     */
    bottomDimStyle(): string {
      return (
        "top:" +
        (this.hiborder.y + this.hiborder.height + MARGIN) +
        "px;bottom:0px;width:100%"
      );
    },
    /**
     * style of the left dim element
     */
    leftDimStyle(): string {
      return (
        "left:0;width:" +
        (this.hiborder.x - MARGIN > 0 ? this.hiborder.x - MARGIN : 0) +
        "px;top:" +
        (this.hiborder.y - MARGIN > 0 ? this.hiborder.y - MARGIN : 0) +
        "px;height:" +
        (this.hiborder.height + MARGIN + MARGIN) +
        "px"
      );
    },
    /**
     * style of the border element
     */
    borderstyle(): string {
      let height = this.hiborder.height + 2 * MARGIN - 2 * HIGHLIGHTBORDERWIDTH;
      let top = this.hiborder.y - MARGIN + window.scrollY;
      if (top < 40) {
        height += top - 40;
        top = 40;
      }
      return (
        "left:" +
        (this.hiborder.x - MARGIN + window.scrollX) +
        "px;top:" +
        top +
        "px;width:" +
        (this.hiborder.width + 2 * MARGIN - 2 * HIGHLIGHTBORDERWIDTH) +
        "px;height:" +
        height +
        "px;border:" +
        HIGHLIGHTBORDERWIDTH +
        "px solid red;"
      );
    }
  },
  methods: {
    /**
     * update highlight from tutorialcontroller
     */
    updateHighlight() {
      this.setHighlight(this.tutController.getHighlight());
    },
    /**
     * Highlight the element described by the string
     */
    setHighlight(elinfo: string) {
      const s = elinfo.split(">");
      // call correct highlight method
      switch (s[0]) {
        case "canvas":
          this.highlightCanvas();
          break;
        case "blocklist":
          this.highlightBlockListElement(s[1]);
          break;
        case "block":
          this.highlightCanvasElement(s[1], s.length > 2 ? s[2] : "");
          break;
        default:
          if (elinfo == "") return;
          this.highlighted = document.getElementById(s[0]);
          this.setBorder();
      }
    },
    /**
     * highlight the canvas
     */
    highlightCanvas() {
      this.highlighted = this.canvas.$el;
      this.setBorder();
    },
    /**
     * highlight block in the blocklist
     */
    async highlightBlockListElement(name: string) {
      // scroll block into view
      this.blocklist.scrollToBlock(name);

      // wait until scroll finished
      await Vue.nextTick();

      // get blockview
      const blockview = this.blocklist.getBlockView(name);

      // if blocknot found, return null
      if (blockview == undefined) this.highlighted = null;

      // highlight blockview
      this.highlighted = blockview.$el;
      this.setBorder();
    },
    /**
     * Highlight block or element of block on the canvas
     * @param name reference name of block
     * @param blockel name of element of block. if "", whole block will be highlighted
     */
    async highlightCanvasElement(name: string, blockel = "") {
      // wait until all blocks are placed
      await Vue.nextTick();
      await Vue.nextTick();
      await Vue.nextTick();
      await Vue.nextTick();

      // get the block by reference
      const b = this.tutController.getRef(name);

      // if reference found
      if (b != undefined) {
        // get view of block
        this.highlighted = document.getElementById("block" + b.getId());
      } else this.highlighted = null;

      // if element of block needs highlight
      if (this.highlighted != null && blockel != "") {
        // get element of block
        const elname = blockel.split("#")[0];
        const index = parseInt(blockel.split("#")[1]);
        this.highlighted = this.highlighted.getElementsByClassName(elname)[
          index
        ] as HTMLElement | null;
      }

      // set the border
      this.setBorder();
    },

    /**
     * Updates the border around the highlighted element
     */
    setBorder() {
      if (this.highlighted != null) {
        //this.highlighted.scrollIntoView({ behavior: "auto", block: "center" });
        this.hiborder = this.highlighted.getBoundingClientRect();
      } else this.hiborder = new DOMRect(0, 0, 0, 0);
    },
    /**
     * called when highlighted element is clicked. Sends it to the tutorialcontroller
     */
    onClick() {
      if (this.tutController.onClick()) {
        this.highlighted.click(); // activate click event on element
      }
    },
    /**
     * called on release event on highlighted element. Sends it to the tutorialcontroller
     */
    onRelease() {
      this.tutController.onRelease();
    },
    scrollLock(state: boolean) {
      if (this.blocklist != undefined) {
        this.blocklist.scrollLock(state);
      }
      if (this.canvas != undefined){
        this.canvas.scrollLock(state);
      }
    }
  },
  beforeDestroy() {
    // remove event listeners
    this.highlighted?.removeEventListener(
      "mousedown",
      this.tutController.onClick
    );
    this.highlighted?.removeEventListener(
      "mouseup",
      this.tutController.onRelease
    );
    window.removeEventListener("resize", this.updateHighlight);
    window.addEventListener("scroll", this.updateHighlight);
  },
  mounted() {
    window.addEventListener("resize", this.updateHighlight);
    window.addEventListener("scroll", this.updateHighlight);
  },
  watch: {
    highlighted: {
      /**
       * update event listeners when new highlighted element
       */
      handler(newval: HTMLElement | null, oldval: HTMLElement | null) {
        // remove event listeners from old element
        if (oldval == newval) return;
        oldval?.removeEventListener("mousedown", this.onClick);
        oldval?.removeEventListener("mouseup", this.onRelease);

        // add event listeners to new element
        if (newval == null) return;
        newval?.addEventListener("mousedown", this.onClick);
        newval?.addEventListener("mouseup", this.onRelease);
      },
      immediate: true
    },
    tutController: {
      handler(newval: TutorialController, oldval: TutorialController) {
        // set highlight when highlight value updates
        if (newval.started()) {
          this.scrollLock(true);
        } else this.scrollLock(false);
        this.$nextTick(() => {
          this.updateHighlight();
        });
      },
      immediate: true,
      deep: true
    }
  }
});
</script>

<style scoped>
.dim {
  background-color: #00000080;
  position: fixed;
  z-index: 1;
  pointer-events: all;
}
.hiborder {
  background-color: #00000000;
  position: absolute;
}
</style>
