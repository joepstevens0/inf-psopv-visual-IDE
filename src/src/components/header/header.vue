<template>
  <header>
    <!-- header -->
    <div class="headerleft">
      <button
        class="basicbutton"
        id="saveButton"
        v-show="displaySaveButton"
        v-on:click="onSave()"
      >
        Opslaan
      </button>
      <button class="basicbutton" v-if="loggedIn" v-on:click="onSaveAs()">
        Opslaan als
      </button>
      <button class="basicbutton" v-on:click="onLoad()">Laden</button>
      <button class="basicbutton" v-on:click="onShare()">Delen</button>
      <button class="basicbutton" v-on:click="onReset()">Herstel canvas</button>
      <button class="basicbutton" v-on:click="showTutorials()">
        Lessen
      </button>
      <button
        class="basicbutton"
        v-if="isAdmin"
        v-on:click="showTutorialCreate()"
      >
        Maak les
      </button>
    </div>
    <div class="headerright">
      <div v-if="loggedIn">
        <p v-html="username" class="headerText"></p>
        <button class="basicbutton" @click="logout">Uitloggen</button>
      </div>
      <div v-else>
        <button class="basicbutton" @click="register">Registreer</button>
        <button class="basicbutton" @click="login">Inloggen</button>
      </div>
    </div>

    <!-- hidden menus -->
    <tutoriallist
      ref="tutorialEl"
      v-bind:controller="projectcontroller"
      v-bind:canvas="canvas"
      v-bind:blocklist="blocklist"
      @loginRequired="loginRedirect"
      @load="startProject"
      @editTutorial="editTutorial"
    ></tutoriallist>
    <tutorialcreate
      ref="tutorialcreateEl"
      v-bind:blocklist="blocklist"
      @loginRequired="loginRedirect"
    ></tutorialcreate>
    <save
      ref="save"
      @loginRequired="loginRedirect"
      @projectSaved="userLoadedSavedProject"
    ></save>
    <load
      ref="load"
      @loadProject="loadProject"
      @loginRequired="loginRedirect"
      @projectSaved="userLoadedSavedProject"
      @projectRemoved="projectRemoved"
    ></load>
    <share ref="share"></share>
    <login ref="login"></login>
    <register ref="register"></register>

    <confirmPopup 
      ref="loadConfirmPopup"
      @confirmPopupResponse="loadProjectPopup"
    ></confirmPopup>
    <confirmPopup 
      ref="resetConfirmPopup"
      @confirmPopupResponse="resetPopup"
    ></confirmPopup>
  </header>
</template>

<script lang="ts">
import Vue from "vue";
import Logger from "@/util/logger";

import save from "./save.vue";
import load from "./load.vue";
import share from "./share.vue";
import login from "./login.vue";
import register from "./register.vue";

import tutoriallist from "../tutorial/tutoriallist.vue";
import tutorialcreate from "../tutorial/tutorialcreate/tutorialcreate.vue";

import Project from "@/datastructures/project/project";
import ProjectController from "@/datastructures/controllers/projectcontroller";

import confirmPopup from "@/components/confirmPopup.vue";

export default Vue.extend({
  props: {
    project: {
      class: Project,
      required: true
    },
    projectcontroller: {
      class: ProjectController,
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
      username: "",
      loggedIn: false,
      isAdmin: false,
      displaySaveButton: false,
      projectName: "",
      loadProjectJSON: ""
    };
  },
  mounted() {
    // get the current user login
    this.username = this.$store.getters.username;
    this.isAdmin = this.$store.getters.isAdmin;
    this.loggedIn = this.$store.getters.isLoggedIn;

    // update user login data on change
    this.$store.subscribe((mutation, state) => {
      this.username = this.$store.getters.username;
      this.isAdmin = this.$store.getters.isAdmin;
      this.loggedIn = this.$store.getters.isLoggedIn;
    });
  },
  methods: {
    /**
     * Save the current project over the loaded project
     */
    onSave() {
      // TODO add appropriate error/success message
      Logger.info("'save' button clicked");
      const data = {
        projectName: this.projectName,
        project: this.project.save()
      };
      this.$store
        .dispatch("save", data)
        .then(() => {
          // show success message
          document.getElementById("saveButton").innerHTML = "Opslaan &check;";
          setTimeout(function () {
            document.getElementById("saveButton").innerHTML = "Opslaan";
          }.bind(this), 2000);

          this.$emit("projectSaved");
        })
        .catch(err => {
          if (err.response) {
            Logger.debug(err.response.data);
            if (
              typeof err.response !== "undefined" &&
              typeof err.response.data !== "undefined" &&
              typeof err.response.data.name !== "undefined"
            ) {
              // jwt expired
              this.loginRedirect();
            } else {
              //this.error = err.response.data;
              document.getElementById("saveButton").innerHTML = "Opslaan X";
              setTimeout(function () {
                document.getElementById("saveButton").innerHTML = "Opslaan";
              }.bind(this), 2000);
            }
          } else {
            //this.error = err;
            document.getElementById("saveButton").innerHTML = "Opslaan X";
            setTimeout(function () {
              document.getElementById("saveButton").innerHTML = "Opslaan";
            }.bind(this), 2000);
          }
        });
    },

    /**
     * show save menu
     */
    onSaveAs() {
      Logger.info("'save as' button clicked");
      this.$refs.save.setProject(this.project);
      this.$refs.save.toggleVisibility();
    },

    /**
     * show load menu
     */
    onLoad() {
      Logger.info("'load' button clicked");
      this.$refs.load.load();
      this.$refs.load.toggleVisibility();
    },

    /**
     * show share menu
     */
    onShare() {
      Logger.info("'share' button clicked");
      this.$refs.share.setProject(this.project);
      this.$refs.share.toggleVisibility();
    },

    /**
     * show the list of tutorials
     */
    showTutorials() {
      this.$refs.tutorialEl.loadTutorials();
      this.$refs.tutorialEl.toggleVisibility();
    },

    /**
     * show the menu for creating tutorials
     */
    showTutorialCreate() {
      this.$refs.tutorialcreateEl.toggleVisibility();
    },

    /**
     * logout the current user
     */
    logout() {
      Logger.info("'logout' button clicked");
      this.displaySaveButton = false;
      this.projectName = "";
      this.$store.dispatch("logout");
    },

    /**
     * show login menu
     */
    login() {
      Logger.info("'login' button clicked");
      this.$refs.login.toggleVisibility();
    },

    /**
     * if JWT expired, redirect user to login panel
     */
    loginRedirect() {
      this.username = "";
      this.isAdmin = false;
      this.loggedIn = false;
      this.displaySaveButton = false;
      this.projectName = "";
      this.login();
    },

    /**
     * show register menu
     */
    register() {
      Logger.info("'register' button clicked");
      this.$refs.register.toggleVisibility();
    },

    /**
     * Ask the user if he wants to load the project
     * @param projectJSON project data in string format
     * @post a popup appears asking the user to confirm his action
     */
    loadProject(projectJSON: string) {
      this.loadProjectJSON = projectJSON;
      this.$refs.loadConfirmPopup.confirm(
        "Als je een ander project inlaadt gaat het huidige project verloren als je het nog niet hebt opgeslaan. Ben je zeker dat je een ander project wil inladen?"
      );
    },
    /**
     * Load a project after asking the user
     * @param response boolean according to users decision
     * @post the project in projectJSON is loaded
     */
    loadProjectPopup(response: boolean) {
      if (response) {
        Logger.info("hiding 'save' button");
        const project = Project.load(this.loadProjectJSON);
        const projectcontroller = new ProjectController(project);
        this.$refs.load.toggleVisibility();
        if (this.projectName != "") {
          this.displaySaveButton = true;
        } else {
          this.displaySaveButton = false;
        }

        this.startProject(project, projectcontroller);
      }
    },
    /**
     * Start a project
     * @post project is loaded on the canvas
     */
    startProject(project: Project, controller: ProjectController) {
      this.$emit("load", project, controller);
    },
    /**
     * Called when a user loads a saved project
     */
    userLoadedSavedProject(projectName: string) {
      this.displaySaveButton = true;
      Logger.info("displaying 'save' button");
      this.projectName = projectName;
    },
    /**
     * Display the save button
     */
    toggleSaveButton() {
      this.displaySaveButton = true;
      Logger.info("displaying 'save' button");
    },
    onReset() {
      this.$refs.resetConfirmPopup.confirm(
        "Als je het canvas herstelt gaat het huidige project verloren als je het nog niet hebt opgeslaan. Ben je zeker dat je het canvas wil herstellen?"
      );
    },
    resetPopup(response: boolean) {
      if (response) {
        const project = new Project("unnamed");
        const projectcontroller = new ProjectController(project);
        this.displaySaveButton = false;
        this.projectName = "";
        this.$emit("load", project, projectcontroller);
      }
    },
    /**
     * load a tutorial into the tutorialcreate
     * @post tutorialcreate is opened with tutorial data
     */
    editTutorial(tutorial: { name: string; tutorialdata: string }) {
      this.$refs.tutorialcreateEl.editTutorial(tutorial);
    },
    projectRemoved(projectName: string) {
      if (projectName == this.projectName) {
        this.displaySaveButton = false;
        this.projectName = "";
      }
    }
  },
  components: {
    tutoriallist,
    tutorialcreate,
    save,
    load,
    share,
    login,
    register,
    confirmPopup
  }
});
</script>

<style scoped>
header {
  border-bottom: 2px solid black;
  height: 40px;
  background-color: var(--headercolor);
}
@import url(../../assets/basicbutton.css);
.headerleft {
  float: left;
}
.headerright {
  float: right;
}
.headerText {
  display: inline-block;
  margin: 5px;
}
</style>
