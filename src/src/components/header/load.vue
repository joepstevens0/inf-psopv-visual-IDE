<template>
  <div class="load">
    <div v-show="show" v-on:click="toggleVisibility" class="mask"></div>
    <div v-show="show" class="loadcontainer">
      <div class="listtable">
        <div class="listhead">Project Laden</div>
        <div class="close" v-on:click="toggleVisibility"></div>
        <div v-if="projects.length > 0" class="projectscontainer">
          <table>
            <tr
              v-for="(projectData, index) in projects"
              :key="projectData.projectname"
            >
              <td>{{ projectData.projectname }}</td>
              <td>
                <button class="basicbutton" @click="loadProject(projectData.project, projectData.projectname)">
                  Selecteer project
                </button>
              </td>
              <td>
                <div @click="removeProject(index)" class="removebutton">X</div>
              </td>
            </tr>
          </table>
        </div>
        <p v-else>Geen projecten gevonden.</p>
        <p>{{ error1 }}</p>
        <button class="basicbutton" v-if="noLogin" @click="login">Inloggen</button>
        <br />
        <div class="loadshared">
          <p style="display:inline-block;">Laden met code:</p>
          <input v-model="projectID" />
          <button class="basicbutton" style="display:inline-block;" @click="loadShared">
            Laden
          </button>
          <p>{{ error2 }}</p>
        </div>
      </div>
    </div>
    <confirmPopup 
      ref="removeProjectPopup"
      @confirmPopupResponse="removeProjectPopup"
    ></confirmPopup>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Logger from "@/util/logger";
import confirmPopup from "@/components/confirmPopup.vue";

export default Vue.extend({
  props: {},
  data() {
    return {
      show: false as boolean,
      projects: [] as { project: string; projectname: string }[],
      projectID: "" as string,
      noLogin: false,
      error1: "",
      error2: "",
      removeIndex: 0
    };
  },
  methods: {
    toggleVisibility() {
      this.show = !this.show;
      this.projectID = "";
      this.noLogin = false;
      this.error1 = "";
      this.error2 = "";
      this.projects = [];
      this.removeIndex = 0;
    },
    loadProject(project: string, projectName: string) {
      Logger.debug(projectName, project);
      Logger.info("project", projectName, "loaded");
      this.$emit("loadProject", project);
      this.$emit("projectSaved", projectName);
    },
    login() {
      this.toggleVisibility();
      this.$emit("loginRequired");
    },
    load() {
      //send load request to server to load all projects saved by the user
      this.$store
        .dispatch("load")
        .then(resp => {
          // show list of all stored projects
          this.projects = resp.data.projects;
        })
        .catch(err => {
          if (err.response) {
            //console.log(err.response.data);
            if (
              typeof err.response !== "undefined" &&
              typeof err.response.data !== "undefined" &&
              typeof err.response.data.name !== "undefined"
            ) {
              // jwt expired
              this.noLogin = true;
              this.error1 =
                "Je moet inloggen om eerder opgeslagen projecten te zien.";
            } else {
              this.error1 = err.response.data;
            }
          } else {
            //console.log(err);
            this.error1 = err;
          }
        });
    },
    removeProject(index: number) {
      this.removeIndex = index;
      this.$refs.removeProjectPopup.confirm(
        "Ben je zeker dat je het project '" +
          this.projects[index].projectname +
          "' wil verwijderen?"
      );
    },
    removeProjectPopup(response: boolean) {
      if (response) {
        const data = { projectname: this.projects[this.removeIndex].projectname };
        this.$store
          .dispatch("deleteproject", data)
          .then(() => {
            this.error1 = "project succesvol verwijderd";
            // remove project from project list
            this.$emit("projectRemoved", this.projects[this.removeIndex].projectname);
            this.projects.splice(this.removeIndex, 1);            
          })
          .catch(err => {
            if (err.response) {
              //console.log(err.response.data);
              if (
                typeof err.response !== "undefined" &&
                typeof err.response.data !== "undefined" &&
                typeof err.response.data.name !== "undefined"
              ) {
                // jwt expired
                this.login();
              } else {
                this.error1 = err.response.data;
              }
            } else {
              //console.log(err);
              this.error1 = err;
            }
          });
      }
    },
    loadShared() {
      //send load request to server to load the project linked to the provided projectID
      const data = {
        projectID: this.projectID
      };
      this.$store
        .dispatch("loadshared", data)
        .then(resp => {
          // show success message
          //this.projects = resp.data.projects;
          this.$emit("loadProject", resp.data.project);
        })
        .catch(err => {
          if (err.response) {
            //console.log(err.response.data);
            this.error2 = err.response.data;
            /*if (err.response.data.name) {
                // jwt expired
                this.$router.push("/login");
              }*/
          } else {
            //console.log(err);
            this.error2 = err;
          }
        });
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
  z-index: 3;
}
.load {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.loadcontainer {
  pointer-events: all;
  min-width: 300px;
  height: auto;
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

.projectscontainer {
  overflow-y: scroll;
  height: 400px;
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

input {
  margin: 5px;
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 15px;
  width: auto;
}
@import url(../../assets/basicbutton.css);
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
</style>
