<template>
<g class="erroroverview">
  <!-- Shows number of errors and warnings -->
  <foreignObject :x="overviewX" y="0" width="15%" height="10%">
    <div id="errorov" @click="setList(!showlist)" v-bind:class="{numberhighlight: showlist}">
        <!-- Image for warnings -->
        <img draggable="false" src="../../assets/img/erroricons/alert-24.png" alt="WarningIcon" class="erroricon">
        <!-- Number of warnings -->
        {{ warningcount }}

        <!-- Image for errors -->
        <img draggable="false" src="../../assets/img/erroricons/error-5-24.png" alt="ErrorIcon" class="erroricon">
        <!-- Number of errors -->
        {{ errorcount }}
      </div>
  </foreignObject>
  <foreignObject v-if="showlist" :x="0" y="0" width="100%" height="100%" style="pointer-events:none">
      <div class="errorlist"> 
        <ol>
          <h3>
        Fouten:</h3>
          <li v-for="(error, index) in errors()" v-bind:key="index" class="erroritem">
            {{ error }}
          </li>
          <li v-if="errors().length <= 0">Geen fouten gevonden.</li>
        </ol>
        <ol>
        <h3>Waarschuwingen:</h3>
          <li v-for="(warning, index) in warnings()" v-bind:key="index" class="warningitem">
            {{ warning }}
          </li>
          <li v-if="warnings().length <= 0">Geen waarschuwingen gevonden.</li>
        </ol>
        
      </div>
  </foreignObject>
</g>
</template>

<script lang="ts">
import Vue from "vue";
import ProjectController from '../../datastructures/controllers/projectcontroller';
import ErrorController from '../../datastructures/controllers/errorcontroller';
import Logger from "@/util/logger";


export default Vue.extend({
  props: {
    projectcontroller: {
      class: ProjectController || null,
      required: true
    },
    canvasWidth: {
      class: Number,
      required: true
    }
  },
  data() {
    return {
      overviewX: "0%",
      errorcount: -1,
      warningcount: -1,
      showlist: false
    }
  },
  methods: {
    setList(open: boolean) {
      this.showlist = open;
    },
    //Init the horizontal position to the width of the overview
    updatePosition() : void {
      let x = 0;
      if (document.getElementById("errorov")){ 
        // x = 100% - width of canvasOverview in % - width of this overview - a little space 
        x =  50 - ((document.getElementById("errorov").getBoundingClientRect().width / this.canvasWidth) * 100)/2;
      } 
      
      if (x < 0){
        x = 0;
      } else if (x > 100) {
        x = 100;
      }

      this.overviewX = x + "%";
    },
    updateValues() : void {
      if (this.projectcontroller){
        this.errorcount = this.projectcontroller.getErrorController().getErrorcount();
        this.warningcount = this.projectcontroller.getErrorController().getWarningcount();
      }
    },
    errors(): string[]{
      return this.projectcontroller.getErrorController().getErrors();
    },
    warnings(): string[]{
      return this.projectcontroller.getErrorController().getWarnings();
    }
  },

  /*
  Position of the erroroverview needs to be calculated when:
  */
  // Mounted because of right position when initialized.
  mounted() {
    this.updatePosition();
    this.updateValues();
  },
  // CanvasWidth changes, because then the position of the overview needs to go to the left or the right.
  watch : {
    canvasWidth: function (newWidth, oldWidth) {
      this.updatePosition();
    },
    projectcontroller: {
      handler : function (newController, oldController) {
        this.updateValues();
      },
      deep: true,
    }
  },
  // Errorcount or warningcount changes, because the width of the overview could change.
  updated() {
    this.updatePosition();
    this.updateValues();
  },
})
</script>

<style scoped>
.erroroverview {
  pointer-events: none;
}
.erroricon {
    -webkit-filter: drop-shadow(0.5px 0.5px 0.5px #222);
    filter: drop-shadow(0.5px 0.5px 0.5px #222); 
}

#errorov {
  border: 1px solid black;
  border-radius: 5px;
  margin: 2px;
  width: fit-content;
  pointer-events: none;

  /* color: white; */
  font-family: Arial, Helvetica, sans-serif;
  pointer-events: all;
  /* text-shadow:
  -0.5px -0.5px 0 #000,  
  0.5px -0.5px 0 #000,
  -0.5px 0.5px 0 #000,
  0.5px 0.5px 0 #000; */
}
#errorov:hover{
  background-color: var(--appbackgroundcolor);
  cursor: pointer;
}
.numberhighlight {
  background-color: var(--ioheadercolor);
}
.errorlist{
  display: block;
  margin:auto;
  margin-top: 30px;
  background-color: var(--ioheadercolor);
  width: 400px;
  height: fit-content;
  max-height: calc(100% - 100px);
  border-radius: 10px;
  border: 1px solid black;
  overflow-y: auto;
  user-select: text;
  padding:0px;
  z-index: 2;
  pointer-events: all;
}
ol{
  list-style: none;
}
li{
  display: inline-block;
  margin: 5px;
  padding: 10px;
  border-radius: 15px;

  color: white;
  font-family: Arial, Helvetica, sans-serif;
  text-shadow:
  -0.5px -0.5px 0 #000,  
  0.5px -0.5px 0 #000,
  -0.5px 0.5px 0 #000,
  0.5px 0.5px 0 #000;
  width: 300px;
}

.erroritem{
  background: var(--errorbackgroundcolor);
  border: 1px solid var(--errorbordercolor);
}
.warningitem{
  background: var(--warningbackgroundcolor);
  border: 1px solid var(--warningbordercolor);
}
h3{
  color: white;
  margin:0px;
}

</style>
