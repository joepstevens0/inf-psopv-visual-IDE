<template>
  <div
    id="variableview"
    @mouseup="unSelectBlocklist">
    <header class="header">
      Variabelen
    </header>
    <div class="view">
      <!-- Input to make a new variable -->
      <input class="inputname" ref="inputname" placeholder="naam" />
      <input class="inputval" ref="inputwaarde" placeholder="waarde" />
      <button class="basicbutton" v-on:click="addvar">Voeg variabele toe</button>

      <!-- Table to display all variables -->
      <div class="variablelist">
        <table>
          <th class="blockhead">blok</th>
          <th>huidige waarde</th>
          <th style="width:40px"></th>

          <tr v-for="(v, index) in vars" v-bind:key="v.name">

            <!-- Display varBlock -->
            <td>
              <svg>
                <g v-on:mousedown="getBlock($event, v.name, index)">
                  <blockview
                    x="5"
                    y="5"
                    v-bind:_projectcontroller="controller"
                    v-bind:_block="varBlocks[index]"
                  ></blockview>
                </g>
              </svg>
            </td>
            <!-- Display value of var -->
            <td class="varval">{{ v.value }}</td>
            <!-- Display cross to delete var -->
            <td class="cross" style="padding:0" v-on:click="onDelete(v.name)">
              <svg style="width:40px;height:40px">
                <line x1="0" y1="0" x2="40" y2="40" style="stroke:rgb(0,0,0);stroke-width:2"></line>
                <line x1="40" y1="0" x2="0" y2="40" style="stroke:rgb(0,0,0);stroke-width:2"></line>
              </svg>
            </td>

          </tr>

        </table>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ProjectVars from "@/datastructures/project/projectvars";
import ProjectController from "@/datastructures/controllers/projectcontroller";
import { VarBlock } from "@/datastructures/blocks/valueblocks/valueblocks";
import blockview from "../block/blockview.vue";

import Logger from "@/util/logger";

import ActionController from '../../datastructures/controllers/actioncontroller';

export default Vue.extend({
  props: {
    projectvars: {
      type: ProjectVars,
      required: true
    },
    controller: {
      validator: function(prop) {
        return prop == null || prop instanceof ProjectController;
      },
      required: true
    }
  },
  computed: {
    // Returns list of all vars in project
    vars(): { name: string; value: string }[] {
      //Create empty list
      let l: { name: string; value: string }[] = [];
      //Get all vars
      for (let i = 0; i < this.projectvars.nVars(); ++i) {
        const n = this.projectvars.getVarName(i);
        l = [{ name: n, value: this.projectvars.valueOf(n) }].concat(l);
      }
      //Return list
      return l;
    },

    // Makes a list of new varBlocks for every var
    varBlocks(): VarBlock[] {
      //Make an empty list
      const l = [];
      //For every var: make a block, init it and add it to the list
      for (let i = 0; i < this.vars.length; ++i) {
        const b = new VarBlock();
        b.setProjectVars(this.projectvars);
        b.setVarName(this.vars[i].name);
        l.push(b);
      }
      //Return the list of new varBlocks
      return l;
    }
  },
  methods: {
    //Adds a new variable to the projectvars
    addvar() {
      //If there was no value given, method is invalid
      if(this.$refs.inputname.value == ""){
        return;
      }

      // Add actioncontroller, so action can be undone with undo 
      this.projectvars.setVar(this.$refs.inputname.value, this.$refs.inputwaarde.value, this.controller.getActionController());
    },

    // Gets a block out of the variableview
    getBlock(evt: MouseEvent, name: string, index: number) {

      this.controller.getDragController().setClientPos([evt.clientX, evt.clientY]);

      //If there is already a block being dragged, return
      if (this.controller.getDragController().getSelectedBlock() != null){ 
        return
      }

      //Else pick up a copy of the wanted varBlock
      const b = new VarBlock();
      b.setProjectVars(this.projectvars);
      b.setVarName(name);
      /*this.controller.getBlockController().newBlock(b, [
        evt.clientX - evt.target.getBoundingClientRect().left,
        evt.clientY - evt.target.getBoundingClientRect().top
      ]);*/
      const block = this.varBlocks[index];
      const blockEl = document.getElementById("block" + block.getId());
      this.controller.getBlockController().newBlock(b, [
        evt.clientX - blockEl.getBoundingClientRect().left,
        evt.clientY - blockEl.getBoundingClientRect().top
      ]);
    },

    // Deletes a variable when pressed on the X in variableview
    onDelete(name: string){
      if (this.controller){
        Logger.info("Trying to delete a variable. Checking instances on canvas.");
        Logger.debug("Trying to delete variable:", name);

        //First check if there is still an instance on the canvas.
        if (this.controller.getBlockController().varinstanceOnCanvas(name)){
          Logger.info("Deletion cancelled, instances of variable found on canvas.");

          //Notify with pop-up
          this.controller.getBlockController().notifyObservers("VarDel cancelled");

        } else {
          Logger.info("No instances found, deleting variable.");
          Logger.debug("Deleting variable:", name);

          // Add actioncontroller, so action can be undone with undo 
          this.projectvars.deleteVar(name, this.controller.getActionController());
        }
      }
    },

    // When a block is dragged across the variableview and mouse is released, block gets deleted, just like in blocklist
    unSelectBlocklist(){
      if (this.controller.getDragController().getSelectedBlock() != null)
        this.controller.getBlockController().deleteSelectedBlock();
    }
  },
  components: {
    blockview
  }
});
</script>

<style scoped>
#variableview {
  margin-left: 5px;
  padding: 0px;
  border: 1px solid black;
}
.view {
  overflow: auto;
  height: calc(100% - 33px);
  background-color: var(--backgroundcolor);
}
.variablelist {
  width: 100%;
  height: calc(100% - 60px);
}

table {
  clear: both;
  border-collapse: collapse;
  margin: 1px;
  width: 99.5%;
}
th,
td {
  border: 1px solid black;
}
.varval {
  width: 100px;
  max-width: 400px;
  overflow: auto;
  text-align: center;
}
input {
  float: left;
  width: auto;
}
button {
  float: right;
  width: 100%;
}
svg {
  height: 50px;
  width: 100%;
}
.cross{
  width:40px;
  height:40px
}
.cross:hover{
  background-color: #555555;
  cursor: pointer;
}
.blockhead{
  min-width: 150px;
}

.inputname{
  width: 25%;
}
.inputval{
  width: calc(70% - 2px);
  margin-left: 2px;
}
@import url(../../assets/basicbutton.css);
.basicbutton {
  width: 99%;
  float: none;
  margin: 25px auto 5px auto;
  display: block;
}
.header {
  color: white;
  padding: 7px;
  border-bottom: 1px solid black;
  background-color: var(--ioheadercolor);
}
</style>
