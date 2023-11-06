<template>
  <div class="register">
    <div v-show="show" v-on:click="toggleVisibility" class="mask"></div>
    <div v-show="show" class="registercontainer">
      <div class="listtable">
        <div class="listhead">Registreer</div>
        <div class="close" v-on:click="toggleVisibility"></div>
        <form @submit.prevent="register">
          <div class="registeritem">
            <label>Gebruikersnaam:</label>
            <input required v-model="username" type="text" placeholder="" />
          </div>
          <div class="registeritem">
            Kies je login optie:
            <button class="basicbutton" v-bind:class="{notchosenbutton : !showgrid, chosenbutton: showgrid}" v-on:click="showgrid = true" type="button">Patroon</button>
            <button class="basicbutton" v-bind:class="{notchosenbutton : showgrid, chosenbutton: !showgrid}" v-on:click="showgrid = false" type="button">Tekst</button>
          </div>
          <div class="registeritem">
            <label>Wachtwoord:</label>
            <passwordgrid v-if="showgrid" ref="passwordgrid"> </passwordgrid>
            <input v-else v-model="textpassword" required type="password" placeholder="" />
          </div>
          <div class="registeritem">
            <label>Herhaal Wachtwoord:</label>
            <passwordgrid v-if="showgrid" ref="passwordgridconfirmation"> </passwordgrid>
            <input v-else v-model="textpasswordconfirm" required type="password" placeholder="" />
          </div>
          <button class="basicbutton" type="submit">Registreer</button>
          <p>{{ error }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import passwordgrid from "./passwordgrid.vue";
import Logger from '@/util/logger';

export default Vue.extend({
  data() {
    return {
      show: false as boolean,
      username: "",
      error: "",
      showgrid: true,
      textpassword: "",
      textpasswordconfirm: ""
    };
  },
  mounted() {
    //
  },
  methods: {
    /**
     * Toggle visibility of register pop-up
     */
    toggleVisibility() {
      this.show = !this.show;
      this.username = "";
      if (this.$refs.passwordgrid != undefined) this.$refs.passwordgrid.clear();
      if (this.$refs.passwordgridconfirmation != undefined)
        this.$refs.passwordgridconfirmation.clear();
      this.textpassword = "";
      this.textpasswordconfirm = "";
      this.error = "";

      this.showgrid = true;
    },
    /**
     * Checks if username is valid, else display an error
     * @returns true if username is valid
     */
    checkUsername(): boolean {
      if (this.username.length < 1) {
        this.error = "Gebruikersnaam moet minstens 1 teken lang zijn";
        return false;
      }
      for (let i = 0; i < this.username.length; i++) {
        if (this.username[i] == " ") {
          this.error = "Gebruikersnaam mag geen spatie bevatten";
          return false;
        }
      }
      return true;
    },

    /**
     * Checks if passwords are filled in correct, else display an error
     * @returns true if passwords are filled in correctly
     */
    checkPasswords(): boolean {
      if (this.showgrid) return this.checkgrid();
      return this.checkText();
    },

    /**
     * Check if text passwords are filled in correctly
     * @returns true if text passwords are filled in correctly
     */
    checkText(): boolean{
      if (this.textpassword.length < 6){
        this.error = "Wachtwoord moet minstens 6 tekens lang zijn";
        return false;
      }
      if (this.textpasswordconfirm.length <= 0) {
        this.error = "Het wachtwoord moet een 2de keer ingevuld worden.";
        return false;
      }
      if (this.textpassword != this.textpasswordconfirm){
        this.error = "Er moet 2 keer hetzelfde wachtwoord ingevuld worden.";
        return false;
      }
      return true;
    },
    /**
     * Check if grid passwords are filled in correctly
     * @returns true if grid passwords are filled in correctly
     */
    checkgrid(): boolean{
      if (this.$refs.passwordgrid.getPassword() == "000000000") {
        this.error = "Er moet minstens 1 vakje aangeduid worden.";
        return false;
      }
      if (this.$refs.passwordgridconfirmation.getPassword() == "000000000") {
        this.error = "Het wachtwoord moet een 2de keer ingevuld worden.";
        return false;
      }
      if (this.$refs.passwordgrid.getPassword() != this.$refs.passwordgridconfirmation.getPassword()) {
        this.error = "Er moet 2 keer hetzelfde wachtwoord ingevuld worden.";
        return false;
      }
      return true;
    },

    /**
     * Try to register an user
     * @post user is registered if all data is correct
     */
    register() {
      if ( !(this.checkPasswords() && this.checkUsername()) ) return;

      const data = {
        username: this.username,
        password: this.showgrid
          ? this.$refs.passwordgrid.getPassword()
          : this.textpassword
      };
      // Logger.debug("Register |", "Trying to register with data:", data);
      this.$store
        .dispatch("register", data)
        .then(() => {
          this.show = false;
        })
        .catch(err => {
          if (err.response) {
            Logger.error("Register |", err.response.data);
            this.error = err.response.data;
          } else {
            Logger.error("Register |", err);
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
.register {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 3;
}
.registercontainer {
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

@import url(../../assets/basicbutton.css);
.basicbutton {
  padding: 10px;
  padding-bottom: 25px;
  width: 200px;
}

.registeritem {
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
