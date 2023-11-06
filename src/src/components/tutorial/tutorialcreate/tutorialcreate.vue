<template>
  <div class="tutorialcreate">
    <div v-show="show" v-on:click="toggleVisibility" class="mask"></div>
    <div v-show="show" class="tutorialcreatecontainer">
      <div class="close" v-on:click="toggleVisibility"></div>
      <input
        ref="namefield"
        placeholder="Naam van de les"
        class="tutorialname"
      />
      <br />
      <tutorialcreatestep
        v-bind:blocklist="blocklist"
        v-on:newstep="newStep"
        ref="stepcreate"
      ></tutorialcreatestep>
      <tutorialcreatesteplist ref="steplist" v-on:addRef="addRef"></tutorialcreatesteplist>
      <button class="finishbutton" v-on:click="finish">Les opslaan</button>
      <p>{{ error }}</p>
    </div>
    <confirmPopup 
      ref="updateTutorialPopup"
      @confirmPopupResponse="existingTutorial"
    ></confirmPopup>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ProjectController from "@/datastructures/controllers/projectcontroller";

import tutorialcreatestep from "./tutorialcreatestep.vue";
import tutorialcreatesteplist from "./tutorialcreatesteplist.vue";
import Logger from "@/util/logger";
import confirmPopup from "@/components/confirmPopup.vue";

export default Vue.extend({
  components: {
    tutorialcreatestep,
    tutorialcreatesteplist,
    confirmPopup
  },
  props: {
    blocklist: {
      required: true
    }
  },
  data() {
    return {
      controller: null as ProjectController | null,
      show: false as boolean,
      selectedNextButton: false,
      error: "",
      tutorialData: "",
      tutorialloaded: false
    };
  },
  methods: {
    /**
     * toggle visibility of window
     */
    toggleVisibility() {
      this.show = !this.show;
      this.error = "";

      if (this.tutorialloaded){
        this.tutorialloaded = false;
        this.clear();
      }
    },
    /**
     * Start login window
     */
    login() {
      this.toggleVisibility();
      this.$emit("loginRequired");
    },
    /**
     * finish creating tutorial
     * @post new tutorial will be added to the database
     * @post creation errors will be shown
     */
    finish() {
      const tutorial = {
        name: this.$refs.namefield.value,
        data: this.$refs.steplist.createTutorial()
      };

      //const tut = tutorialdata.tutorials[1];
      //const tutorial = { name: tut.name, data: tut.data.join("") };

      // TEMPSTART
      /*import("../assets/tutorials.json").then(obj => {
        obj.tutorials.push(tutorial);
      });*/
      // TEMPEND

      // TODO insert turorial in database
      this.$store
        .dispatch("savetutorial", tutorial)
        .then(() => {
          // show success message
          Logger.info("tutorial succesvol opgeslagen");
          this.toggleVisibility();
          this.$refs.namefield.value = "";
          this.$refs.steplist.clear();
          this.$refs.stepcreate.clear();
        })
        .catch(err => {
          if (err.response) {
            Logger.debug(err.response);
            Logger.error(err.response.data);
            if (err.response.status == 409) {
              // ask user if he wants to overwrite existing tutorial
              this.tutorialData = tutorial;
              this.$refs.updateTutorialPopup.confirm("Tutorial bestaat al, druk op OK om deze tutorial te overschrijven.");
            }
            if (
              typeof err.response !== "undefined" &&
              typeof err.response.data !== "undefined" &&
              typeof err.response.data.name !== "undefined"
            ) {
              // jwt expired
              this.login();
            } else {
              this.error = err.response.data;
            }
          } else {
            //console.log(err);
            this.error = err;
          }
        });
    },
    existingTutorial(response: boolean) {
      if (response) {
        this.updateTutorial(this.tutorialData);
      }
    },
    updateTutorial(tutorial) {
      this.$store
        .dispatch("updatetutorial", tutorial)
        .then(() => {
          // show success message
          Logger.info("tutorial succesvol opgeslagen");
          this.toggleVisibility();
          this.clear();
        })
        .catch(err => {
          if (err.response) {
            Logger.error(err.response.data);
            if (
              typeof err.response !== "undefined" &&
              typeof err.response.data !== "undefined" &&
              typeof err.response.data.name !== "undefined"
            ) {
              // jwt expired
              this.login();
            } else {
              this.error = err.response.data;
            }
          } else {
            //console.log(err);
            this.error = err;
          }
        });
    },
    /**
     * add a new step to the steplist
     */
    newStep(step) {
      this.$refs.steplist.addStep(step);
    },
    /**
     * load a tutorial into the creation
     * @param tutorial data of tutorial
     */
    editTutorial(tutorial: { name: string; tutorialdata: string }) {
      this.toggleVisibility();
      this.$refs.namefield.value = tutorial.name;
      this.$refs.steplist.load(tutorial.tutorialdata);
      this.tutorialloaded = true;
    },

    addRef(refname: string, blockname: string) {
      this.$refs.stepcreate.addBlockRef(refname, blockname);
    },

    /**
     * reset tutorial creation to default values
     */
    clear() {
      this.$refs.namefield.value = "";
      this.$refs.steplist.clear();
      this.$refs.stepcreate.clear();
    }
  }
});
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
  z-index: 3;
}
.tutorialcreate {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.tutorialcreatecontainer {
  pointer-events: all;
  min-width: 300px;
  min-height: 300px;
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
.tutorialname {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 15px;
  width: 50%;
}

.close {
  position: absolute;
  right: 15px;
  top: 15px;
  width: 32px;
  height: 32px;
  opacity: 1;
}
.close:hover {
  opacity: 0.3;
  cursor: pointer;
}
.close:before,
.close:after {
  position: absolute;
  left: 15px;
  content: " ";
  height: 33px;
  width: 2px;
  background-color: #333;
}
.close:before {
  transform: rotate(45deg);
}
.close:after {
  transform: rotate(-45deg);
}

.finishbutton {
  clear: both;
  margin-right: 60px;
  margin-top: 30px;
  margin: 5px;
  background-color: var(--basicbutton);
  border: 1px solid var(--basicbuttonbordercolor);
  border-radius: 10px;
  color: white;
  font-size: 30px;
  padding: 10px;
  width: 100%;
}
.finishbutton:hover {
  background-color: var(--basicbuttonhovercolor);
  cursor: pointer;
}
</style>
