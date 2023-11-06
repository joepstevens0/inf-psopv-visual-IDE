<template>
<g class="errorpopup">
  <!-- Pops up whenever there is a new error found -->
  <transition name="pop-up">
    <foreignObject class="foreignobj" v-if="show" x="0" y="0" width="30%" height="15%">
        <div class="pop-updiv" :style='"background: "+backgroundcolor+"; border: 2px solid "+bordercolor'>
            {{ message }}
        </div>
    </foreignObject>
  </transition>
</g>
</template>

<script lang="ts">
import Vue from "vue";
import ProjectController from '../../datastructures/controllers/projectcontroller';
import ErrorController from '../../datastructures/controllers/errorcontroller';
import Logger from "@/util/logger";
import { Observer } from "@/util/observer"

const errorborder = "var(--errorbordercolor)";
const errorbackground = "var(--errorbackgroundcolor)";
const warningborder = "var(--warningbordercolor)";
const warningbackground = "var(--warningbackgroundcolor)";

class ErrorListener implements Observer {
  update(message: any) {
    //If error detected
    if ( message instanceof Array && message[0] == "ERROR" ){
      Logger.info("Error detected, throwing pop-up.");
      this._message = "Fout: " + message[1];
      this.setErrorColors();
      this.showPopup();

      // Else if warning detected
    } else if (message instanceof Array && message[0] == "WARNING") {
      Logger.info("Warning detected, throwing pop-up.");
      this._message = "Waarschuwing: " + message[1];
      this.setWarningColors();
      this.showPopup();

    //Else if tried to delete function
    } else if (message == "FuncDel cancelled"){
      Logger.info("Tried to delete a function with instances on canvas, throwing pop-up.");
      this._message = "Deze functie wordt nog  gebruikt op het canvas en kan niet verwijderd worden.";
      this.setWarningColors();
      this.showPopup();

    //Else if tried to delete var
    } else if (message == "VarDel cancelled"){
      Logger.info("Tried to delete a variable with instances on canvas, throwing pop-up.");
      this._message = "Deze variabele staat nog op het canvas en kan niet verwijderd worden.";
      this.setWarningColors();
      this.showPopup();
    }    
  }

  // Sets colors to color of a warning message
  private setWarningColors() {
    this.setColors(warningborder, warningbackground);
  }

  // Sets colors to color of an error message
  private setErrorColors() {
    this.setColors(errorborder, errorbackground);
  }

  // Sets color of border and background of pop-up
  private setColors(border: string, background: string) {
    this._backgroundcolor = background;
    this._bordercolor = border;
  };

  //Shows the pop-up for 3 seconds
  private showPopup() : void {
    this._show = true;
    setTimeout( () => {this._show = false;}, 3000);
  }

  public constructor() {
    this._message = "";
    this._show = false;
    this._bordercolor = errorborder;
    this._backgroundcolor = errorbackground;
  }

  public getMessage(): string{
    return this._message;
  }

  public getShow() : boolean {
    return this._show;
  }

  public getBordercolor() : string{
    return this._bordercolor;
  }

  public getBackgroundcolor() : string{
    return this._backgroundcolor;
  }

  private _message: string;
  private _show: boolean;
  private _bordercolor: string;
  private _backgroundcolor: string;
}


export default Vue.extend ({
  props: {
    projectcontroller: {
      class: ProjectController || null,
      required: true
    },
  },
  
  data() {
    return {
        listener: new ErrorListener()
    }
  },

  computed : {
    message() : string {
      return this.listener.getMessage();
    },
    bordercolor() : string {
      return this.listener.getBordercolor();
    },
    backgroundcolor() : string {
      return this.listener.getBackgroundcolor();
    },
    show() : boolean {
      return this.listener.getShow()
    },
  },

  //Watch for a change in projectcontroller
  watch : {
    projectcontroller: {
      handler : function (newController, oldController) {
          //If controller is not null
          if (newController != null){
            //Add listener to block, error and exec controller
            this.projectcontroller.getBlockController().addObserver(this.listener);
            this.projectcontroller.getErrorController().addObserver(this.listener);
            this.projectcontroller.getExecController().addObserver(this.listener);
          }
      },
      deep: true,
    }
  },
})
</script>

<style scoped>
.pop-updiv{
    margin: 5px;
    padding: 10px;
    border-radius: 15px;

    color: white;
    font-family: Arial, Helvetica, sans-serif;
    text-shadow:
    -0.5px -0.5px 0 #000,  
    0.5px -0.5px 0 #000,
    -0.5px 0.5px 0 #000,
    0.5px 0.5px 0 #000;
    position: absolute;
    background: var(--errorbackgroundcolor);
    border: 1px solid var(--errorbordercolor);
    pointer-events: none;
}
.foreignobj{
  pointer-events: none;
}
.pop-up-enter-active, .pop-up-leave-active {
  transition: opacity .5s;
}
.pop-up-enter, .pop-up-leave-to {
  opacity: 0;
}
</style>
