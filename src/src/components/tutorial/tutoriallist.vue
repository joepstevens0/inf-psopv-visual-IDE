<template>
  <div class="tutoriallist">
    <div v-show="show" v-on:click="toggleVisibility" class="mask"></div>
    <tutorial
      ref="tutorialelement"
      v-bind:controller="controller"
      v-bind:canvas="canvas"
      v-bind:blocklist="blocklist"
      v-on:load="onLoad"

    ></tutorial>
    <div v-show="show" class="tutoriallistcontainer">
      <div class="listtable">
        <div class="listhead">Lessen</div>
        <div class="close" v-on:click="toggleVisibility"></div>
        <div
          v-for="(t, index) in tutorials"
          v-bind:key="index"
          class="tutorialbutton"
          v-on:click="startTutorial(index)"
        >
        <div class="tutorialbuttontext">
          {{ t.name }}
          </div>
          <div v-if="isAdmin" @click="removeTutorial($event,index)" class="removebutton">X</div>
          <div v-if="isAdmin" @click="editTutorial($event, index)" class="editbutton">wijzig</div>
        </div>
        <p>{{error}}</p>
        <div style="clear: both;"></div> 
      </div>
      <br />
    </div>

    <starttutorialpopup
      @startStarttutorial="startStarttutorial()"
    >
    </starttutorialpopup>
    <confirmPopup 
      ref="tutorialConfirmPopup"
      @confirmPopupResponse="startTutorialPopup"
    ></confirmPopup>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import ProjectController from "@/datastructures/controllers/projectcontroller";
import tutorial from "./tutorial.vue";
import starttutorialpopup from "./starttutorialpopup.vue";
import confirmPopup from "@/components/confirmPopup.vue";
import Logger from "@/util/logger.ts";

export default Vue.extend({
  props: {
    controller: {
      validator: function(prop) {
        return prop == null || prop instanceof ProjectController;
      },
      required: true
    },
    canvas: {
      required: true
    },
    blocklist: {
      required: true
    }
  },
  data() {
    return {
      show: false as boolean,
      //tutorials: tutorialdata.tutorials as { name: string; data: string[] }[],
      tutorials: [] as { name: string; tutorialdata: string[] }[],
      isAdmin: false,
      error: "",
      starttutorialindex: 0,
    };
  },

  mounted() {
    this.loadTutorials();
  },

  methods: {
    // Toggles visibility of menu
    toggleVisibility() {
      this.show = !this.show;
      this.isAdmin = this.$store.getters.isAdmin;
    },

    login() {
      this.toggleVisibility();
      this.$emit("loginRequired");
    },

    // Loads all tutorials from json to data of this element
    loadTutorials() {
      this.$store
        .dispatch("loadtutorials")
        .then((resp) => {
          // show success message
          this.tutorials = resp.data.tutorials;
        })
        .catch(err => {
          if (err.response) {
              //console.log(err.response.data);
              this.error = err.response.data;
          }
          else {
              //console.log(err);
              this.error = err;
          }
      });
    },
    // Starts tutorial on index index
    startTutorial(index: number) {
      this.startIndex = index;
      this.$refs.tutorialConfirmPopup.confirm("Als je een les start gaat het huidige project verloren als je het nog niet hebt opgeslaan. Ben je zeker dat je de les wil starten?");
    },

    // Starts tutorial on index index
    startTutorialPopup(response: boolean) {
      if (response) {
        this.toggleVisibility();
        //console.log(this.tutorials);
        this.$refs.tutorialelement.start(this.tutorials[this.startIndex].name ,this.tutorials[this.startIndex].tutorialdata);
      }
    },

    // Emit a message for header
    onLoad(project: Project, projectcontroller: ProjectController) {
      this.$emit("load", project, projectcontroller);
    },

    // Removes a tutorial with index index
    removeTutorial(event: MouseEvent,index:number){
      if (confirm("Ben je zeker dat je "+ this.tutorials[index].name +" wil verwijderen?")) {
        const data = {name: this.tutorials[index].name};
        this.$store
          .dispatch("deletetutorial", data)
          .then(() => {
            // show success message
            //console.log("tutorial succesvol verwijderd");
            this.tutorials.splice(index, 1);
          })
          .catch(err => {
            if (err.response) {
                //console.log(err.response.data);
                if (typeof err.response !== 'undefined' && typeof err.response.data !== 'undefined' && typeof err.response.data.name !== 'undefined') {
                  // jwt expired
                  this.login();
                }
                else {
                  this.error = err.response.data;
                }
            }
            else {
                //console.log(err);
                this.error = err;
            }
        });
      }
      event.stopPropagation();
    },

    // Edit tutorial with index index
    editTutorial(event: MouseEvent, index: number) {
      event.stopPropagation();
      this.toggleVisibility();
      this.$emit("editTutorial", this.tutorials[index]);
    },

    // Starts startTutorial
    startStarttutorial() : void {
      // Check if there are tutorials and if tutorialindex is valid
      if ( (this.tutorials.length > 0) && (this.starttutorialindex < this.tutorials.length-1) ) {
        // Start starttutorial
        this.$refs.tutorialelement.start(this.tutorials[this.starttutorialindex].name ,this.tutorials[this.starttutorialindex].tutorialdata);

      // If not, log error
      } else {
        Logger.error("StartTutorial not found, ignoring starttutorial");
        
      }
      
    }
  },
  components: {
    tutorial,
    starttutorialpopup,
    confirmPopup
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
.tutoriallist {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.tutoriallistcontainer {
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
.listtable {
  padding: 10px;
}

.listhead {
  padding: 5px;
  font-size: 25px;
  text-align: center;
  border-bottom: 1px solid black;
}
.tutorialbutton {
  border: 1px solid black;
  margin: 5px;
  padding: 10px;
  font-size: 20px;
  display: block;
  float: left;
  width: 30%;
  border-radius: 15px;
  background-color: white;
  color: black;
  text-align: center;
  line-height: 50px;
}
.tutorialbutton:hover {
  background-color: #eeeeee;
  cursor: pointer;
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
.removebutton {
  color: red;
  float:right;
  position:relative;
  margin:0;
  padding:0;
  cursor:pointer;
  width: 30px;
  height: 30px;
  font-size: 30px;
  font-family: Arial, sans-serif;
  font-weight: 300;
}
.removebutton:hover{
  opacity: 0.3;
  cursor: pointer;
}

.editbutton {
  float: right;
  border: 1px solid black;
  border-radius: 10px;
  margin: 10px 5px 10px 0;
  height: 30px;
  width: 50px;
  text-align: center;
  line-height: 30px;
  opacity: 0.5;
  font-size: 18px;
}
.editbutton:hover {
  opacity: 1;
  cursor: pointer;
}
.tutorialbuttontext {
  width: calc(100% - 90px);
  display: inline-block;
  overflow-y: none;
  height: 100%;
  font-size: 16px;
}
</style>
