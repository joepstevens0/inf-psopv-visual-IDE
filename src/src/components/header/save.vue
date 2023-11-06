<template>
  <div class="save">
    <div v-show="show" v-on:click="toggleVisibility" class="mask"></div>
    <div v-show="show" class="savecontainer">
      <div class="listtable">
        <div class="listhead">Project Opslaan</div>
        <div class="close" v-on:click="toggleVisibility"></div>
        <form @submit.prevent="save">
          <label>Project naam: </label>
          <input required v-model="projectName" type="text" placeholder="" />
          <button class="basicbutton" type="submit">Opslaan</button>
        </form>
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Project from "../../datastructures/project/project";

export default Vue.extend({
  props: {},
  data() {
    return {
      project: null as Project | null,
      show: false as boolean,
      projectName: "" as string,
      error: ""
    };
  },
  methods: {
    // set projectcontroller
    setProject(project: Project) {
      this.project = project;
    },
    toggleVisibility() {
      this.show = !this.show;
      this.projectName = "";
      this.error = "";
    },
    login() {
      this.toggleVisibility();
      this.$emit("loginRequired");
    },
    save() {
      if (!this.project) {
        return;
      }
      //send save request to server
      const data = {
        projectName: this.projectName,
        project: this.project.save()
      };
      this.$store
        .dispatch("saveAs", data)
        .then(() => {
          // show success message
          this.error = "Project succesvol opgeslaan.";
          this.$emit("projectSaved", this.projectName);
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
              this.error = err.response.data;
            }
          } else {
            //console.log(err);
            this.error = err;
          }
        });
    }
  },
  components: {}
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
.save {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.savecontainer {
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
</style>
