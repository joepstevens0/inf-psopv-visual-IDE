<template>
  <div id="imagecanvas" class="bg">
    <div class="header">
      <button class="basicbutton" v-on:click="reset">herstel</button>
      Afbeeldingen
    </div>
    <svg
      class="imagefield"
      @mousemove="onmove($event)"
      @mouseup="onrelease()"
      @mouseleave="onrelease()"
    >
      <image
        draggable="false"
        ref="imgs"
        v-for="(image, index) in imagedata"
        v-bind:key="index"
        :href="getImageURL(image.link)"
        height="100"
        width="100"
        :x="image.x"
        :y="image.y"
        :transform="scaleTransform(index) + rotatedTransform(index)"
        @mousedown="onMousedown($event, index)"
        @dragstart="$event.preventDefault()"
        @click="onClick($event, index)"
      />
    </svg>
    <div class="imagechoose">
      <div
        v-for="(img, index) in imgoptions"
        :key="img.name"
        class="imageoption"
      >
        <input
          ref="imgoptions"
          type="checkbox"
          v-on:input="optionchange(index)"
          v-bind:checked="img.checked"
        />{{ img.name }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Project from "@/datastructures/project/project";
import { Observer } from "@/util/observer";

import imgjson from "@/assets/images.json";
import ProjectController from '@/datastructures/controllers/projectcontroller';

class MoveListener implements Observer {
  public constructor(
    moveX: (img: string, x: number) => void,
    moveY: (img: string, y: number) => void,
    rotate: (img: string, n: number) => void,
    scale: (img: string, s: number) => void
  ) {
    this._moveX = moveX;
    this._moveY = moveY;
    this._rotate = rotate;
    this._scale = scale;
  }
  update(message: any) {
    if (typeof message == "string") {
      const m = message as string;
      const data = m.split(":");
      if (data[0] == "move") {
        switch (data[2]) {
          case "x":
            this._moveX(data[1], parseInt(data[3]));
            break;
          case "y":
            this._moveY(data[1], parseInt(data[3]));
            break;
          case "rot":
            this._rotate(data[1], parseInt(data[3]));
            break;
          case "scale":
            this._scale(data[1], parseInt(data[3]));
        }
      }
    }
  }
  private _moveX: (img: string, x: number) => void;
  private _moveY: (img: string, y: number) => void;
  private _rotate: (img: string, n: number) => void;
  private _scale: (img: string, s: number) => void;
}

export default Vue.extend({
  props: {
    project: {
      type: Project,
      required: true
    },
    controller: {
      validator: function(prop) {
        return prop == null || prop instanceof ProjectController;
      },
      required: true
    }
  },
  mounted() {
    this.listener = new MoveListener(
      this.moveX,
      this.moveY,
      this.rotate,
      this.scale
    );
    this.project.addObserver(this.listener);

    // add image options
    for (let i = 0; i < imgjson.images.length; ++i) {
      const img = imgjson.images[i];
      this.imgoptions.push({ name: img.name, link: img.link, checked: false });
    }

    this.reset();
    this.updateCheckBoxes();
  },
  data() {
    return {
      listener: null as MoveListener | null,
      grabbed: -1,
      imgoptions: [] as {
        name: string;
        link: string;
        checked: boolean;
      }[]
    };
  },
  computed: {
    imagedata() {
      if (this.project == null) return [];
      return this.project.getProjectImgs().getImagedata();
    }
  },
  methods: {
    /**
     * move an image horizontally
     * @param img image name
     * @param n move amount
     */
    moveX(img: string, n: number) {
      const index = this.nameToIndex(img);
      if (index == -1) return;
      const updateddata = this.imagedata[index];
      updateddata.x += n;
      this.$set(this.imagedata, index, updateddata);
    },
    /**
     * move an image vertically
     * @param img image name
     * @param n move amount
     */
    moveY(img: string, n: number) {
      const index = this.nameToIndex(img);
      if (index == -1) return;
      const updateddata = this.imagedata[index];
      updateddata.y += n;
      this.$set(this.imagedata, index, updateddata);
    },
    /**
     * rotate an image clockwise
     * @param img image name
     * @param n rotate amount
     */
    rotate(img: string, n: number) {
      const index = this.nameToIndex(img);
      if (index == -1) return;
      const updateddata = this.imagedata[index];
      updateddata.rot += n;
      this.$set(this.imagedata, index, updateddata);
    },
    /**
     * scale an image
     * @param img image name
     * @param n scale amount
     */
    scale(img: string, s: number) {
      const index = this.nameToIndex(img);
      if (index == -1) return;
      const updateddata = this.imagedata[index];
      updateddata.scale += s / 100;
      if (updateddata.scale < 0.1) {
        updateddata.scale = 0.1;
      }
      this.$set(this.imagedata, index, updateddata);
    },
    /**
     * get the index of an image name
     */
    nameToIndex(name: string): number {
      for (let i = 0; i < this.imagedata.length; ++i) {
        if (this.imagedata[i].name == name) return i;
      }
      return -1;
    },
    /**
     * reset scale and rotation of images and line them up
     */
    reset() {
      let posx = 0;
      let posy = 0;
      for (let i = 0; i < this.imagedata.length; ++i) {
        const updateddata = this.imagedata[i];
        updateddata.x = posx;
        updateddata.y = posy;
        updateddata.rot = 0;
        updateddata.scale = 1;
        this.$set(this.imagedata, i, updateddata);
        posx += 110;
        if (posx >= 300) {
          posx = 0;
          posy += 110;
        }
      }
    },
    /**
     * get the rotate transform of an image
     * @param index of image
     * @returns rotation transform string
     */
    rotatedTransform(index: number): string {
      if (this.$refs.imgs == undefined) return "";
      const image = this.imagedata[index];

      const halfheight = 50;
      const halfwidth = 50;

      return (
        "translate(" +
        (image.x + halfwidth) +
        ", " +
        (image.y + halfheight) +
        ") rotate(" +
        image.rot +
        ") translate(" +
        (-image.x + -halfwidth) +
        ", " +
        (-image.y + -halfheight) +
        ")"
      );
    },
    /**
     * get the scale transform of an image
     * @param index of image
     * @returns scale transform string
     */
    scaleTransform(index: number): string {
      if (this.$refs.imgs == undefined) return "";

      const image = this.imagedata[index];

      const halfheight = 50;
      const halfwidth = 50;

      return (
        "translate(" +
        (image.x + halfwidth) +
        ", " +
        (image.y + halfheight) +
        ") scale(" +
        image.scale +
        ") translate(" +
        (-image.x + -halfwidth) +
        ", " +
        (-image.y + -halfheight) +
        ")"
      );
    },
    /**
     * Start grab of an image
     */
    onMousedown(event: MouseEvent, index: number) {
      this.grabbed = index;
    },
    /**
     * Click event on image
     */
    onClick(event: MouseEvent, index: number) {
      (this.controller as ProjectController)
        .getExecController()
        .onStart("imageclick:" + this.imagedata[index].name);
    },
    /**
     * move grabbed image to mouse postion
     */
    onmove(event: MouseEvent) {
      if (this.grabbed == -1) return;
      this.imagedata[this.grabbed].x += event.movementX;
      this.imagedata[this.grabbed].y += event.movementY;
    },
    /**
     * release an image from grab
     */
    onrelease() {
      this.grabbed = -1;
    },
    /**
     * Add an image to the canvas or remove if already on the canvas
     * @param index of image
     */
    optionchange(index: number) {
      const pi = this.project.getProjectImgs();
      const option = this.imgoptions[index];
      try {
        pi.addImage(option.name, option.link);
      } catch {
        pi.deleteImg(pi.indexOf(option.name));
      }
      this.$set(this.imgoptions, index, {
        name: option.name,
        link: option.link,
        checked: !option.checked
      });
      this.reset();
    },
    /**
     * updates checkboxes
     */
    updateCheckBoxes() {
      for (let i = 0; i < this.imgoptions.length; ++i) {
        const option = this.imgoptions[i];
        option.checked = false;
        for (let j = 0; j < this.imagedata.length; ++j) {
          const data = this.imagedata[j];
          if (data.name == option.name) {
            option.checked = true;
            break;
          }
        }
      }
    },
    getImageURL(name: string) {
      return require("@/assets/img/imgcanvas/" + name);
    }
  },
  watch: {
    project: {
      handler(newval: Project, oldval: Project) {
        if (this.listener == null) return;
        if (oldval == newval) return;
        if (newval != null) newval.addObserver(this.listener);
        if (oldval != null) oldval.removeObserver(this.listener);
      },
      immediate: true
    },
    imagedata: {
      handler(newval, oldval) {

        if (oldval == newval) return;
        this.updateCheckBoxes();
      },
      immediate: true
    }
  }
});
</script>

<style scoped>
#imagecanvas {
  margin-left: 5px;
  margin-bottom: 5px;
  /*width: 98%;*/
  padding: 0px;
  border: 1px solid black;
  border-radius: 15;
  overflow: hidden;
}
.bg {
  background-color: var(--backgroundcolor);
}
.imagefield {
  border-top: 1px solid black;
  width: 100%;
  height: calc(100% - 56px);
}
image {
  cursor: move;
  -webkit-user-drag: none;
}
.imagechoose {
  width: 100%;
  background-color: white;
  position: relative;
  bottom: 15px;
  z-index: 1;
}
.imageoption {
  float: left;
}

@import url(../../assets/basicbutton.css);

.header {
  color: white;
  background-color: var(--ioheadercolor);
}
</style>
