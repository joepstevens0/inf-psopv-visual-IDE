<template>
  <g class="scrollbar" @wheel="onScroll">
    <rect class="scrollbarbackground" />
    <rect
      v-bind:width="width"
      v-bind:height="height"
      v-bind:x="scrollPosX"
      v-bind:y="scrollPosY"
      @mousedown="onMouseDown"
    />
  </g>
</template>

<script lang="ts">
import { Vue } from "vue-property-decorator";
import Logger from '../util/logger';

const SCROLLBARWIDTH = 10;
const SCROLLBARHEIGHT = 10;

export default Vue.extend({
  props: {
    startX: {
      type: Number,
      required: true
    },
    startY: {
      type: Number,
      required: true
    },
    maxY: {
      type: Number,
      required: true
    },
    maxX: {
      type: Number,
      required: true
    },
    speed: {
      type: Number,
      required: true
    }
  },
  computed: {
    /**
     * true if scrollbar is horizontal
     */
    isHorizontal(): boolean {
      return this.maxX - this.startX > this.maxY - this.startY;
    },

    /**
     * width of the scrollbar
     */
    width(): number {
      // horizontal scrollbars have reversed width
      if (this.isHorizontal) return SCROLLBARHEIGHT * this.speed;

      return SCROLLBARWIDTH;
    },

    /**
     * height of the scrollbar
     */
    height(): number {
      // horizontal scrollbars have reversed height
      if (this.isHorizontal || isNaN(this.speed)) return SCROLLBARWIDTH;

      return SCROLLBARHEIGHT * this.speed;
    },

    /**
     * x position of the scrollbar in the svg element
     */
    scrollPosX(): number {
      return this.startX + this.posX - (this.isHorizontal ? 0 : this.width);
    },

    /**
     * y position of the scrollbar in the svg element
     */
    scrollPosY(): number {
      return this.startY + this.posY - (this.isHorizontal ? this.height : 0);
    },

    /**
     * x percentage scrolled
     */
    xPercent(): number {
      // remove scrollbar width of max
      const realmax = this.maxX - this.width;
      if (realmax == this.startX) return 1;

      return this.posX / (realmax - this.startX);
    },

    /**
     * y percentage scrolled
     */
    yPercent(): number {
      // remove scrollbar height of max
      const realmax = this.maxY - this.height;

      if (realmax == this.startY) return 1;
      return this.posY / (realmax - this.startY);
    }
  },
  data() {
    return {
      dragging: false,
      posX: 0,
      posY: 0
    };
  },
  mounted() {
    // add eventlisteners for global release and move
    window.addEventListener("mouseup", this.onMouseUp);
    window.addEventListener("mousemove", this.onMouseMove);
  },
  beforeDestroy: function() {
    // remove event listeners
    window.removeEventListener("mouseup", this.onMouseUp);
    window.removeEventListener("mousemove", this.onMouseMove);
  },
  methods: {
    /**
     * start drag on mousedown
     */
    onMouseDown(evt: MouseEvent) {
      this.dragging = true;
    },

    /**
     * stop dragging on mouseup
     */
    onMouseUp(evt: MouseEvent) {
      this.dragging = false;
    },

    /**
     * move scrollbar on mousemove
     */
    onMouseMove(evt: MouseEvent) {
      if (this.dragging) {
        // move scrollbar if dragging
        if (this.isHorizontal) this.moveBar(evt.movementX, 0);
        else this.moveBar(0, evt.movementY);
      }
    },

    /**
     * move scrollbar vertical on scroll
     */
    onScroll(evt: MouseWheelEvent) {
      // move scroll up or down
      if (evt.deltaY > 0) this.moveBar(0, this.speed);
      else this.moveBar(0, -this.speed);

      // stop other scrolls
      evt.preventDefault();
    },

    /**
     * move the scrollbar
     * @param deltaX horizontal move amount
     * @param deltaY vertical move amount
     */
    moveBar(deltaX: number, deltaY: number) {
      // move bar
      this.posX += deltaX;
      this.posY += deltaY;

      // clamp bar
      this.clamp();

      // notify observers with new position
      this.$emit("scrollUpdate", this.xPercent, this.yPercent);
      Logger.debug(
        "Scrollbar moved",
        "x:" + deltaX,
        "y:" + deltaY,
        "new position:(" + this.scrollPosX + "," + this.scrollPosY + ")"
      );
    },

    /**
     * clamp scrollbar between min and max
     */
    clamp() {
      // min position
      if (this.posX < this.startX) this.posX = this.startX;
      if (this.posY < this.startY) this.posY = this.startY;

      // max position
      const maxX = this.maxX - (this.isHorizontal ? this.width : 0);
      const maxY = this.maxY - (this.isHorizontal ? 0 : this.height);
      if (this.posX > maxX) this.posX = maxX;
      if (this.posY > maxY) this.posY = maxY;
    },

    /**
     * set posY according to yPercent
     * @param yPercent the new percentage scrolled
     */
    setPercentage(yPercent: number) {
      // remove scrollbar height of max
      const realmax = this.maxY - this.height;

      this.posY = yPercent * (realmax - this.startY);
      this.moveBar(0, 0);
    }
  },
  watch: {
    startX: {
      handler(newval: number, oldval: number) {
        // update position
        this.posX += oldval - newval;
        this.clamp();
        this.$forceUpdate();
      }
    },
    startY: {
      handler(newval: number, oldval: number) {
        // update position
        this.posY += oldval - newval;
        this.clamp();
        this.$forceUpdate();
      }
    },
    maxX: {
      handler(newval: number, oldval: number) {
        if (oldval != 0) this.posX = this.posX * (newval / oldval);
        this.clamp();
        this.$forceUpdate();
      }
    },
    maxY: {
      handler(newval: number, oldval: number) {
        if (oldval != 0) this.posY = this.posY * (newval / oldval);
        this.clamp();
        this.$forceUpdate();
      }
    },
    speed: {
      handler(newval: number, oldval: number) {
        if (oldval != 0 && !isNaN(oldval))
          /*this.moveBar(
            this.posX * (newval / oldval - 1),
            this.posY * (newval / oldval - 1)
          );*/
        this.clamp();
        this.$forceUpdate();
      }
    }
  }
});
</script>

<style scoped></style>
