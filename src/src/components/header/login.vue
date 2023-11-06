<template>
  <div class="login">
    <div v-show="show" v-on:click="toggleVisibility" class="mask"></div>
    <div v-show="show" class="logincontainer">
      <div class="listtable">
        <div class="listhead">Inloggen</div>
        <div class="close" v-on:click="toggleVisibility"></div>
        <form @submit.prevent="login">
          <div class="loginitem">
            <label>Gebruikersnaam:</label>
            <input required v-model="username" type="text" placeholder="" />
          </div>
          <div class="loginitem">
            Kies je login optie:
            <button class="basicbutton" v-bind:class="{notchosenbutton : !showgrid, chosenbutton: showgrid}" v-on:click="showgrid = true" type="button">Patroon</button>
            <button class="basicbutton" v-bind:class="{notchosenbutton : showgrid, chosenbutton: !showgrid}" v-on:click="showgrid = false" type="button">Tekst</button>
          </div>
          <div class="loginitem">
            <label>Wachtwoord:</label>
            <passwordgrid
              v-if="showgrid"
              ref="passwordgrid"
            >
            </passwordgrid>
            <input v-else v-model="textpassword" required type="password" placeholder="" />
          </div>

          <button type="submit" class="basicbutton">Login</button>
          <p>{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import passwordgrid from "./passwordgrid.vue";
import Logger from '@/util/logger';

export default Vue.extend({
  props: {},
  data() {
    return {
      show: false as boolean,
      username: "",
      error: "",
      showgrid: true,
      textpassword: ""
    };
  },
  methods: {
    /**
     * Toggle visibility of login pop-up
     */
    toggleVisibility() {
      this.show = !this.show;
      this.username = "";
      if (this.$refs.passwordgrid != undefined){
        this.$refs.passwordgrid.clear();
      }
      this.textpassword = "";
      this.error = "";
      this.showgrid = true;
    },
    /**
     * Try to login the user
     * @post user is logged in if all data is correct or errors are displayed
     */
    login() {
      const data = {
        username: this.username,
        password: this.showgrid
          ? this.$refs.passwordgrid.getPassword()
          : this.textpassword
      };
      // Logger.debug("Login |", "trying to log in with data: ", data);
      this.$store
        .dispatch("login", data)
        .then(() => {
          this.show = false;
        })
        .catch(err => {
          if (err.response) {
            Logger.error("Login | ", err.response.data);
            this.error = err.response.data;
          } else {
            Logger.error("Login |", err);
            this.error = err;
          }
        });
    }
  },
  components: { passwordgrid }
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
.login {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 3;
}
.logincontainer {
  pointer-events: all;
  min-width: 300px;
  height: fit-content;
  max-width: 1000px;
  margin: auto;
  background-color: white;
  z-index: 3;
  position: relative;
  top: 100px;

  border-radius: 20px;
  padding: 10px;
  background-color:var(--headercolor);
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

@import url(../../assets/basicbutton.css);
.basicbutton {
  padding: 10px;
  padding-bottom: 25px;
  width: 200px;
}

.loginitem {
  width: 100%;
}
input {
  margin: 5px;
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 15px;
  width: auto;
}

.notchosenbutton {
  background: var(--basicbuttonhovercolor);
  opacity: 0.5;
}
.chosenbutton {
  border: 1px solid black;
  background: var(--basicbuttonhovercolor);
}
</style>
