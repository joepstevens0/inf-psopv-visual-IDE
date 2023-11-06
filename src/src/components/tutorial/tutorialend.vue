<template>
  <div class="tutorialend">
    <div v-show="show" v-on:click="stopTutorial" class="mask"></div>
    <div v-show="show" class="tutorialendcontainer">
      <img v-show="showconfetti" src="@/assets/img/confetti.gif" />
      <div class="listtable">
        <div class="listhead">Einde les</div>
        <div class="close" v-on:click="stopTutorial"></div>
        <span>
          Gefeliciteerd je hebt de les
          <div v-on:click="restart" class="tutname">
            {{ tutController.getName() }}
          </div>
          voltooid.
        </span>

        <h2>Meer lessen:</h2>
        <div
          v-for="(t, index) in tutorials"
          v-bind:key="index"
          class="tutorialbutton"
          v-on:click="startTutorial(t.name, t.tutorialdata)"
          v-show="t.name != tutController.getName()"
        >
          {{ t.name }}
        </div>
        <p>{{ error }}</p>
        <div style="clear: both;"></div>
      </div>
      <br />
    </div>
    <confirmPopup 
      ref="tutorialConfirmPopup"
      @confirmPopupResponse="startTutorialPopup"
    ></confirmPopup>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TutorialController from "@/datastructures/controllers/tutorialcontroller";
import Logger from "../../util/logger";
import confirmPopup from "@/components/confirmPopup.vue";

export default Vue.extend({
  props: {
    tutController: {
      type: TutorialController,
      required: true
    }
  },
  computed: {
    show(): boolean {
      return this.tutController.finished();
    }
  },
  data() {
    return {
      //tutorials: tutorialdata.tutorials as { name: string; data: string[] }[],
      tutorials: [] as { name: string; tutorialdata: string }[],
      error: "",
      showconfetti: false,
      tutorialstarted: false
    };
  },
  methods: {
    /**
     * load other tutorials
     */
    loadTutorials() {
      this.$store
        .dispatch("loadtutorials")
        .then(resp => {
          // show success message
          this.tutorials = resp.data.tutorials;
        })
        .catch(err => {
          if (err.response) {
            Logger.error(err.response.data);
            this.error = err.response.data;
          } else {
            Logger.error(err);
            this.error = err;
          }
        });
    },
    startTutorial(name: string, data: string) {
      this.startName = name;
      this.startData = data;
      this.$refs.tutorialConfirmPopup.confirm("Als je een les start gaat het huidige project verloren als je het nog niet hebt opgeslaan. Ben je zeker dat je de les wil starten?");
    },
    /**
     * start a tutorial
     * @param name of next tutorial
     * @param data of next tutorial
     */
    startTutorialPopup(response: boolean) {
      if (response) {
        this.stopTutorial();
        this.$emit("starttut", this.startName, this.startData);
      }
    },
    /**
     * stop the current tutorial
     * @post removes end of tutorial window
     */
    stopTutorial() {
      this.tutController.stop();
    },
    /**
     * restart finished tutorial
     */
    restart() {
      for (let i = 0; i < this.tutorials.length; ++i) {
        if (this.tutorials[i].name == this.tutController.getName()) {
          this.startTutorial(
            this.tutorials[i].name,
            this.tutorials[i].tutorialdata
          );
          return;
        }
      }
    }
  },
  watch: {
    show: {
      handler() {
        this.loadTutorials();
      },
      immediate: true
    }
  },
  components: {
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
  background-image: url("../../assets/img/confetti.gif");
  z-index: 3;
}
.tutorialend {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.tutorialendcontainer {
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
  background-color: rgb(56, 190, 252);
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
  height: 50px;
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
  float: right;
  position: relative;
  margin: 0;
  padding: 0;
  cursor: pointer;
  width: 30px;
  height: 30px;
  font-size: 30px;
  font-family: Arial, sans-serif;
  font-weight: 300;
}
.removebutton:hover {
  opacity: 0.3;
}
img {
  display: block;
  margin: auto;
}
span {
  margin: 10px;
  display: block;
  width: 100%;
  font-size: 30px;
  text-align: center;
}
h2 {
  font-weight: normal;
}
.tutname {
  display: inline;
  color: black;
  font-size: 20px;
  border: 1px solid black;
  border-radius: 10px;
  padding: 5px;
  background-color: white;
  padding-left: 10px;
  padding-right: 10px;
  margin-right: 5px;
}
.tutname:hover {
  cursor: pointer;
  background-color: #eeeeee;
}
</style>
