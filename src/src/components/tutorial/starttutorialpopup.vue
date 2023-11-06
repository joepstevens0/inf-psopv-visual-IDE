<template>
    <!-- Pops up at startup of application -->
    <div class="starttutorialpopup">
        <!-- Make background darker -->
        <div v-show="show" class="mask"></div>
        <!-- Show pop up container -->
        <div v-show="show" class="popupcontainer">
            <div class="listtable">
                <!-- Insert title -->
                <div class="listhead">Welkom, is dit de eerste keer dat je de applicatie gebruikt? <br/> Zo ja, zou je een korte rondleiding willen? </div>

                <!-- Insert 2 buttons -->
                <div class="listitem">
                    <div class="option" v-on:click="startTutorial()">Ja</div>
                    <div class="option" v-on:click="closePopup()">Neen</div>
                </div>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Logger from "@/util/logger";

export default Vue.extend ({
  props: {},
  
  data() {
    return {
        show: true,
    }
  },

  mounted() {
    if (this.$cookies.get("firstTime") && this.$cookies.get("firstTime") == "0") {
      this.show = false;
    }
  },

  methods : {
    // Starts starttutorial when yes is pressed
    startTutorial() : void {
        Logger.info("First time, starting startTutorial.");

        // Close pop up
        this.closePopup();

        // Start starttutorial
        this.$emit("startStarttutorial");

    },
    // Closes pop-up when pressed on the X
    closePopup() : void{
        this.show = false;
        this.$cookies.set("firstTime", "0", "1d");
    },
  },
})
</script>

<style scoped>
.mask {
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: all;
}
.starttutorialpopup {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 3;
}
.popupcontainer {
  pointer-events: all;
  min-width: 300px;
  height: 300px;
  max-width: 1000px;
  margin: auto;
  background-color: white;
  z-index: 3;
  position: relative;
  top: 100px;

  border-radius: 20px;
  padding: 10px;
  background-color: var(--headercolor);
  color: rgb(255, 255, 255);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}
.listtable {
  padding: 10px;
}

.listhead {
  padding: 5px;
  font-size: 25px;
  text-align: center;
  border-bottom: 1px solid black;
}

.listitem {
    width: 100%;
}

.option {
    width: 41%;
    float: left;
    padding: 2%;
    margin: 2%;
    margin-top: 5%;

    text-align: center;
    font-family: Arial, Helvetica, sans-serif;
    text-shadow:
    -0.5px -0.5px 0 #000,  
    0.5px -0.5px 0 #000,
    -0.5px 0.5px 0 #000,
    0.5px 0.5px 0 #000;

    border: 1px solid black;
    border-radius: 10px;
    background: var(--basicbuttonhovercolor);
    cursor: pointer;
}

.option:hover {
    -moz-box-shadow: inset 0 0 10px #000000;
    -webkit-box-shadow: inset 0 0 10px #000000;
    box-shadow: inset 0 0 10px #000000;
}
</style>
