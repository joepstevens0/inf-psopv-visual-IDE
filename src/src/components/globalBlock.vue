<template>
<div>
  <svg
      v-if="
        projectController != null &&
          projectController.getDragController().getSelectedBlock() != null
      "
      id="globalBlock"
      :style="
        'top:' + globalY + 'px;left:' + globalX + 'px;'
      "
    >
      <blockview
        x="0"
        y="0"
        ref="globalBlock"
        :_block="projectController.getDragController().getSelectedBlock()"
        @blockReleased="blockReleased"
      ></blockview>
    </svg>
    <!--
    <svg :style="'position:fixed;width:2px;height:2px;top:' + testY + 'px;left:' + testX + 'px;'">
        <circle r="2" fill="red" />
    </svg>
    -->
</div>
</template>

<script lang="ts">
import Vue from "vue";
import ProjectController from "@/datastructures/controllers/projectcontroller";
import blockview from "./block/blockview.vue";
import Block from "@/datastructures/block/block";
import Logger from "@/util/logger";


export default Vue.extend({
  components: {
    blockview
  },
  props: {
    projectController: {
      validator: function(prop) {
        return prop == null || prop instanceof ProjectController;
      },
      required: true,
    }
  },
  computed: {
    globalX() {
      if (this.projectController?.getDragController().getSelectedBlock()) {
        this.sendHoverEvent(this.projectController.getDragController().getSelectedBlock());          
        return (
          this.projectController.getDragController().getClientPos()[0] -
          this.projectController.getDragController().getSelectedOffset()[0]
        );
      } else {
        return 0;
      }
    },
    globalY() {
      if (this.projectController?.getDragController().getSelectedBlock()) {
        return (
          this.projectController.getDragController().getClientPos()[1] -
          this.projectController.getDragController().getSelectedOffset()[1]
        );
      } else {
        return 0;
      }
    },
    testX() {
      return this.dotX;
    },
    testY() {
      return this.dotY;
    }
  },
  data() {
    return {
      lastElementConnect: null as HTMLElement,
      lastVisibleConnect: false as boolean,
      lastElementAttach: null as HTMLElement,
      lastVisibleAttach: false as boolean,
      lastElementInput: null as HTMLElement,
      lastVisibleInput: false as boolean,
      lastElementAPIConnect: null as HTMLElement,
      lastVisibleAPIConnect: false as boolean,
      lastElementAPIAttach: null as HTMLElement,
      lastVisibleAPIAttach: false as boolean,
      dotX: 0 as number,
      dotY: 0 as number
    };
  },
  mounted() {
    // 
    const blockContainer = document.getElementById("globalBlock");
    if (blockContainer) {
      const blockContainerPos = blockContainer.getBoundingClientRect();
      this.globalBlockInitialX = blockContainerPos.left - 1;
      this.globalBlockInitialY = blockContainerPos.top - 1;
      blockContainer.setAttribute(
        "transform",
        "translate(" +
          -blockContainerPos.left +
          ", " +
          -blockContainerPos.top +
          ")"
      );
    }
  },
  methods: {
    /**
     * Calculate x and y coordinate of puzzle piece connect component
     * @pre block is required to have a Connect component
     * @param block the block to calculate coordinates for
     * @param isConnect boolean, if true calculate connectComponents coordinates, else calculate attachComponents coordinates
     * @param isAPI boolean, if true calculate connect/attach from API block
     * @returns [x, y] array with x and y coordinate
     */
    calculatePuzzleCoordinates(block: Block, isConnect: boolean, isAPI = false) {
      const blockEl = document.getElementById("block" + block.getId());
      let attachEl;
      if (!isAPI) {
        if (isConnect) {
          attachEl = blockEl?.getElementsByClassName("connectview")[0].children[1];
        } else {
          attachEl = blockEl?.getElementsByClassName("attachview")[blockEl?.getElementsByClassName("attachview").length - 1].children[1];
        }
      } else {
        if (isConnect) {
          attachEl = blockEl?.getElementsByClassName("apiconnectview")[0].children[1];
        } else {
          attachEl = blockEl?.getElementsByClassName("apiattachview")[blockEl?.getElementsByClassName("apiattachview").length - 1].children[1];
        }
      }

      const blockX = blockEl?.getBoundingClientRect().x;
      const connectX = attachEl?.getBoundingClientRect().x;
      const connectWidth = attachEl?.getBoundingClientRect().width;

      const blockY = blockEl?.getBoundingClientRect().y;
      const connectY = attachEl?.getBoundingClientRect().y;
      const connectHeight = attachEl?.getBoundingClientRect().height;

      let targetX, targetY;
      if (isConnect) {
        targetX = connectX + (connectWidth / 2);
        targetY = connectY;
      } else {
        targetX = connectX + (connectWidth / 2);
        targetY = connectY;
      }

      return [targetX, targetY];
    },

    /**
     * sends mouseover event to first attachComponent under the blocks connectComponent
     *                                connectComponent under the blocks attachComponent
     * @param block the block for which to send the events
     */
    sendHoverEvent(block: Block) {
      if (block.hasComponent("Connect")) {
        const coordsConnect = this.calculatePuzzleCoordinates(block, true);
        if (!isNaN(coordsConnect[0]) && !isNaN(coordsConnect[1])) {
          this.dotX = coordsConnect[0];
          this.dotY = coordsConnect[1];
          this.sendEventHighlight('mouseover', coordsConnect[0], coordsConnect[1], true);
        }
      }
      if (block.hasComponent("Attach") && document.getElementById("block" + block.getId())?.getElementsByClassName("attachview").length > 0) {
        const coordsAttach = this.calculatePuzzleCoordinates(block, false);
        if (!isNaN(coordsAttach[0]) && !isNaN(coordsAttach[1])) {
          this.dotX = coordsAttach[0];
          this.dotY = coordsAttach[1];
          this.sendEventHighlight('mouseover', coordsAttach[0], coordsAttach[1], false);
        }
      }
      if (block.hasComponent("APIConnect")) {
        const coordsConnect = this.calculatePuzzleCoordinates(block, true, true);
        if (!isNaN(coordsConnect[0]) && !isNaN(coordsConnect[1])) {
          this.dotX = coordsConnect[0];
          this.dotY = coordsConnect[1];
          this.sendEventHighlight('mouseover', coordsConnect[0], coordsConnect[1], true, false, true);
        }
      }
      if (block.hasComponent("APIAttach")) {
        const coordsAttach = this.calculatePuzzleCoordinates(block, false, true);
        if (!isNaN(coordsAttach[0]) && !isNaN(coordsAttach[1])) {
          this.dotX = coordsAttach[0];
          this.dotY = coordsAttach[1];
          this.sendEventHighlight('mouseover', coordsAttach[0], coordsAttach[1], false, false, true);
        }
      }
      this.sendEventHighlight('mouseover', this.projectController.getDragController().getClientPos()[0], this.projectController.getDragController().getClientPos()[1], true, true);
    },

    /** 
     * When a user releases a block try to connect
     */
    blockReleased(evt: any, block: Block) {
      if (block.hasComponent("Connect")) {
        const coordinates = this.calculatePuzzleCoordinates(block, true);
        const targetX = coordinates[0];
        const targetY = coordinates[1];
        if (!this.sendEventComponent('mouseup', targetX, targetY, true)) {
          const coordinates = this.calculatePuzzleCoordinates(block, false);
          const targetX = coordinates[0];
          const targetY = coordinates[1];
          if (this.sendEventComponent('mouseup', targetX, targetY, false)) {
            return;
          }
        }
        else {
          return;
        }
      }
      else if (block.hasComponent("Attach")) {
        const coordinates = this.calculatePuzzleCoordinates(block, false);
        const targetX = coordinates[0];
        const targetY = coordinates[1];
        if (this.sendEventComponent('mouseup', targetX, targetY, false)) {
          return;
        }
      } else if (block.hasComponent("APIConnect")) {
        const coordinates = this.calculatePuzzleCoordinates(block, true, true);
        const targetX = coordinates[0];
        const targetY = coordinates[1];
        if (!this.sendEventComponent('mouseup', targetX, targetY, true, true)) {
          const coordinates = this.calculatePuzzleCoordinates(block, false, true);
          const targetX = coordinates[0];
          const targetY = coordinates[1];
          if (this.sendEventComponent('mouseup', targetX, targetY, false, true)) {
            return;
          }
        }
        else {
          return;
        }
      }
      else if (block.hasComponent("APIAttach")) {
        const coordinates = this.calculatePuzzleCoordinates(block, false, true);
        const targetX = coordinates[0];
        const targetY = coordinates[1];
        if (this.sendEventComponent('mouseup', targetX, targetY, false, true)) {
          return;
        }
      }
      this.sendEvent('mouseup', evt.clientX, evt.clientY);
      evt.stopPropagation();
    },

    /**
     * Sends event on (x, y) position to canvas, blocklist and input components on that position
     * @param event string of the mouse event to send
     * @param x x-coordinate of event
     * @param y y-coordinate of event
     */
    sendEvent(event: string, x: number, y: number) {
      const evt = new MouseEvent(event, {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': x,
        'screenY': y,
        'clientX': x,
        'clientY': y
      });
      /*const el = document.elementFromPoint(x, y);
      console.log(el);
      el.dispatchEvent(evt);*/

      const els = document.elementsFromPoint(x, y);
      Logger.debug("elements on release position", els);
      for (let i = 0; i < els.length; ++i) {
        // allow release of block above canvas, blocklist and input components only. invisibleInput only valid after 2nd element to prevent releasing to own invisibleInput
        if (els[i].getAttribute("class") == "CanvasBackground" || els[i].getAttribute("id") == "blocklist" || (i > 1 && els[i].getAttribute("class")?.includes("invisibleInput"))) {
          els[i].dispatchEvent(evt);
          break;
        }
      }
    },

    /**
     * Sends event on (x, y) position to the first element that is a connect/attach component
     * @param event string of the mouse event to send
     * @param x x-coordinate of event
     * @param y y-coordinate of event
     * @param isConnect boolean, if true send event to attachComponent, else send event to connectComponent
     * @param isAPI boolean, if true check if above connect/attach from API block
     */
    sendEventComponent(event: string, x: number, y: number, isConnect: boolean, isAPI = false): boolean {
      const evt = new MouseEvent(event, {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': x,
        'screenY': y,
        'clientX': x,
        'clientY': y
      });
      /*const el = document.elementFromPoint(x, y);
      console.log(el);
      el.dispatchEvent(evt);*/

      const els = document.elementsFromPoint(x, y);
      Logger.debug("elements on release position, isConnect:", isConnect, els);
      // start loop after 2nd one because that one is the invisible attachcomponent from global block
      for (let i = 2; i < els.length; ++i) {
        if (!isAPI) {
          // allow release of block above connect components only
          if (isConnect) {
            if (els[i].getAttribute("class")?.includes("invisibleAttach")) {
              els[i].dispatchEvent(evt);
              return true;
            }
          } else {
            if (els[i].getAttribute("class")?.includes("invisibleConnect")) {
              els[i].dispatchEvent(evt);
              return true;
            }
          }
        } else {
          // allow release of block above connect components only
          if (isConnect) {
            if (els[i].getAttribute("class")?.includes("invisibleAPIAttach")) {
              els[i].dispatchEvent(evt);
              return true;
            }
          } else {
            if (els[i].getAttribute("class")?.includes("invisibleAPIConnect")) {
              els[i].dispatchEvent(evt);
              return true;
            }
          }
        }
      }
      return false;
    },

    /**
     * Sends event on (x, y) position to the top element on that position that is a connect or attach component
     * @param event string of the mouse event to send
     * @param x x-coordinate of event
     * @param y y-coordinate of event
     * @param isConnect true if function called for block with connect component, else false
     * @param isInput true if function needs to check if cursor above input field
     * @param isAPI boolean, if true check if above connect/attach from API block
     */
    sendEventHighlight(event: string, x: number, y: number, isConnect: boolean, isInput = false, isAPI = false) {
      const evt = new MouseEvent(event, {
        'view': window,
        'bubbles': false,
        'cancelable': true,
        'screenX': x,
        'screenY': y,
        'clientX': x,
        'clientY': y
      });

      const els = document.elementsFromPoint(x, y);
      //Logger.debug(els);
      /*if (isInput) {
        console.log(els);
      }*/
      let lastVisibleStill = false;
      if (!isInput) {
        if (!isAPI) {
          // start loop after 2nd one because that one is the invisible attach/connect component from global block
          for (let i = 2; i < els.length; ++i) {
            if (isConnect && els[i].getAttribute("class")?.includes("invisibleAttach")) {
              //Logger.debug("inside attach");
              els[i].dispatchEvent(evt);
              this.lastVisibleConnect = true;
              // check if lastElement is still the same, else send mouseleave event to lastElement before overwriting it
              if (this.lastElementConnect != els[i]) {
                this.sendEventToLast('mouseleave', x, y, isConnect);
              }
              this.lastElementConnect = els[i];
              lastVisibleStill = true;
              break; // skip looping once an attach has been reached
            }
            else if (!isConnect && els[i].getAttribute("class")?.includes("invisibleConnect")) {
              //Logger.debug("inside attach");
              els[i].dispatchEvent(evt);
              this.lastVisibleAttach = true;
              // check if lastElement is still the same, else send mouseleave event to lastElement before overwriting it
              if (this.lastElementAttach != els[i]) {
                this.sendEventToLast('mouseleave', x, y, isConnect);
              }
              this.lastElementAttach = els[i];
              lastVisibleStill = true;
              break; // skip looping once an attach has been reached
            }
            // check if any parent has class "blockview" and if so break
            /*const parents = this.getParents(els[i]);
            let hasParentBlockview = false;
            for (let j = 0; j < parents.length; ++j) {
              if (typeof parents[j]?.getAttribute === "function" && parents[j]?.getAttribute("class")?.includes("blockview")) {
                hasParentBlockview = true;
                break;
              }
            }
            if (hasParentBlockview) {
              break;
            }*/
          }
        } else {
          // start loop after 2nd one because that one is the invisible attach/connect component from global block
          for (let i = 2; i < els.length; ++i) {
            if (isConnect && els[i].getAttribute("class")?.includes("invisibleAPIAttach")) {
              //Logger.debug("inside attach");
              els[i].dispatchEvent(evt);
              this.lastVisibleAPIConnect = true;
              // check if lastElement is still the same, else send mouseleave event to lastElement before overwriting it
              if (this.lastElementAPIConnect != els[i]) {
                this.sendEventToLast('mouseleave', x, y, isConnect, isInput, isAPI);
              }
              this.lastElementAPIConnect = els[i];
              lastVisibleStill = true;
              break; // skip looping once an attach has been reached
            }
            else if (!isConnect && els[i].getAttribute("class")?.includes("invisibleAPIConnect")) {
              //Logger.debug("inside attach");
              els[i].dispatchEvent(evt);
              this.lastVisibleAPIAttach = true;
              // check if lastElement is still the same, else send mouseleave event to lastElement before overwriting it
              if (this.lastElementAPIAttach != els[i]) {
                this.sendEventToLast('mouseleave', x, y, isConnect, isInput, isAPI);
              }
              this.lastElementAPIAttach = els[i];
              lastVisibleStill = true;
              break; // skip looping once an attach has been reached
            }
          }
        }
      } else {
        for (let i = 1; i < els.length; ++i) {
          if (els[i].getAttribute("class")?.includes("hoverInput")) {
            els[i].dispatchEvent(evt);
            this.lastVisibleInput = true;
            // check if lastElement is still the same, else send mouseleave event to lastElement before overwriting it
            if (this.lastElementInput != els[i]) {
              this.sendEventToLast('mouseleave', x, y, isConnect, isInput);
            }
            this.lastElementInput = els[i];
            lastVisibleStill = true;
            break; // skip looping once an attach has been reached
          }
        }
      }

      if (!lastVisibleStill) {
        //Logger.debug("leaving attach");
        this.sendEventToLast('mouseleave', x, y, isConnect, isInput, isAPI);
      }
    },

    /**
     * return list of parents of an element
     * @param elem
     * @return list of elements that are a parent of elem
     */
    getParents(elem: any) {
      const parents = [];
      while(elem.parentNode && elem.parentNode.nodeName.toLowerCase() != 'body') {
        elem = elem.parentNode;
        parents.push(elem);
      }
      return parents;
    },

    /**
     * Sends event on (x, y) position to lastElement
     * @param event string of the mouse event to send
     * @param x x-coordinate of event
     * @param y y-coordinate of event
     * @param isConnect true if function called for block with connect component, else false
     * @param isInput true if function needs to check if cursor above input field
     * @param isAPI boolean, if true check if above connect/attach from API block
     */
    sendEventToLast(event: string, x: number, y: number, isConnect: boolean, isInput = false, isAPI = false) {
      const evt = new MouseEvent(event, {
        'view': window,
        'bubbles': false,
        'cancelable': true,
        'screenX': x,
        'screenY': y,
        'clientX': x,
        'clientY': y
      });
      if (!isInput) {
        if (!isAPI) {
          if (isConnect) {
            if (this.lastElementConnect) {
              const el = this.lastElementConnect;
              el.dispatchEvent(evt);
              this.lastElementConnect = null;
              this.lastVisibleConnect = false;
            }
          }
          else {
            if (this.lastElementAttach) {
              const el = this.lastElementAttach;
              el.dispatchEvent(evt);
              this.lastElementAttach = null;
              this.lastVisibleAttach = false;
            }
          }
        } else {
          if (isConnect) {
            if (this.lastElementAPIConnect) {
              const el = this.lastElementAPIConnect;
              el.dispatchEvent(evt);
              this.lastElementAPIConnect = null;
              this.lastVisibleAPIConnect = false;
            }
          }
          else {
            if (this.lastElementAPIAttach) {
              const el = this.lastElementAPIAttach;
              el.dispatchEvent(evt);
              this.lastElementAPIAttach = null;
              this.lastVisibleAPIAttach = false;
            }
          }
        }
      }
      else {
        if (this.lastElementInput) {
            const el = this.lastElementInput;
            el.dispatchEvent(evt);
            this.lastElementInput = null;
            this.lastVisibleInput = false;
          }
      }
    },
  }
});
</script>

<style scoped>
#globalBlock {
  width: 100px;
  height: 100px;
  z-index: 100;
  /*display: none;*/
  position: fixed;
  overflow: visible;
}
</style>
