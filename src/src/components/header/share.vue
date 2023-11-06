<template>
  <div class="share">
    <div v-show="show" v-on:click="toggleVisibility" class="mask"></div>
    <div v-show="show" class="sharecontainer">
      <div class="listtable">
        <div class="listhead">Project Delen</div>
        <div class="close" v-on:click="toggleVisibility"></div>
        <div class="sharemain">
          <button class="basicbutton" style="margin-right:15px;" @click="share">
            Genereer code
          </button>
          <p style="display:inline-block;">Code: {{ code }}</p>
          <p>{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Project from "../datastructures/project/project";

export default Vue.extend({
  props: {},
  data() {
    return {
      project: null as Project | null,
      show: false as boolean,
      code: "" as string,
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
      this.code = "";
      this.error = "";
    },
    share() {
      if (!this.project) {
        return;
      }
      //send save request to server
      const data = {
        project: this.project.save()
      };
      this.$store
        .dispatch("share", data)
        .then(resp => {
          // show success message
          //console.log("project succesvol opgeslagen");
          //console.log(resp.data.code);
          this.code = resp.data.code;
          this.error = "";
        })
        .catch(err => {
          if (err.response) {
            //console.log(err.response.data);
            this.error = err.response.data;
            /*if (err.response.data.name) {
                // jwt expired
                this.$router.push("/login");
              }*/
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
.share {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.sharecontainer {
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

.sharemain {
  margin-top: 5px;
  user-select: text;
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
@import url(../../assets/basicbutton.css);
button {
  margin: 5px;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 25px;
}
</style>
