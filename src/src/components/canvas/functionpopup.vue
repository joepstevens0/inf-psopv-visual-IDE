<template>
    <!-- Pops up when a functon needs a new name -->
    <div class="functionpopup">
        <!-- Make background darker -->
        <div v-show="show" class="mask" v-on:click="closePopup"></div>
        <!-- Show pop up container -->
        <div v-show="show" class="popupcontainer">
            <div class="listtable">
                <div class="listhead">Geef de functie een naam:</div>
                <!-- Make sure the popup can be exited when the function already has a name -->
                <div v-show="!firstTime" class="close" v-on:click="closePopup"></div>

                <form @submit.prevent="nameChange">
                    <div class="popupitem">
                        <label>Naam voor de functie: </label>
                        <input required v-model="newname" type="text" placeholder="" />
                    </div>
                    <button type="submit" class="submitbutton">Ok</button>
                    <p>{{error}}</p>
                </form>

            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
import Project from "../../datastructures/project/project";
import ProjectController from '../../datastructures/controllers/projectcontroller';
import Logger from "@/util/logger";
import { Observer } from "@/util/observer"
import { FunctionEncloseBlock } from '../../datastructures/blocks/blockclasses';

class NamechangeListener implements Observer {
  update(message: any) {
    if ( message[0] != undefined &&
      
      (message[0] as string).startsWith("FunctionEnclose namechange")
    ) {
        this._function = message[1];
        Logger.info("Function needs name, throwing pop-up.");
        this.setShow(true);
        this._name = (message[0] as string).split(":")[1];
    } 
  }

  public constructor() {
    this._show = false;
    this._function = null;
  }

  public getShow() : boolean {
    return this._show;
  }

  public setShow(bool: boolean) : void {
      this._show = bool;
  }

  public getFunctionBlock() : FunctionEncloseBlock {
      return this._function;
  }

  public getStartName(): string {
    return this._name;
  }

  private _name = "";
  private _show: boolean;
  private _function: FunctionEncloseBlock;
}


export default Vue.extend ({
  props: {
    projectcontroller: {
      class: ProjectController || null,
      required: true
    },
    project: {
      class: Project,
      required: true
    }
  },
  
  data() {
    return {
        listener: new NamechangeListener(),
        newname: "",
        error: ""
    }
  },

  computed : {
    show() : boolean {
      return this.listener.getShow()
    },
    // Returns true if it's the first time the function gets named
    firstTime() : boolean {
      if (this.listener.getFunctionBlock()){
        return ((this.listener.getFunctionBlock() as FunctionEncloseBlock).getFunctionName() == "");
      } else {
        return true;
      }
    }
  },

  mounted() {
    this.project.addObserver(this.listener);
  },

  methods : {
    // Function gets executed when submitbutton is pressed
    nameChange() : void{
        // Check if input is correct
        // ProjectController == null can't happen, since pop-up can only be used if projectcontroller != null
        if ((this.newname != ""  && !(this.projectcontroller.getBlockController().funcExists(this.newname))) || this.newname == this.listener.getStartName()){
            //Set functionname
            (this.listener.getFunctionBlock() as FunctionEncloseBlock).changeFunctionName(this.newname);

            // Clear pop-up
            this.newname = "";

            // Hide the pop-up
            this.listener.setShow(false);
        } else {
            // Give errorfeedback and wait until name is valid
            this.error = "Deze naam is reeds in gebruik.";
        }
    },
    // Closes pop-up when pressed on the X
    closePopup() : void{
      if (!this.firstTime)
        this.listener.setShow(false);
    },
  },

  //Watch for a change in projectcontroller
  watch : {
    projectcontroller: {
      handler : function (newController, oldController) {
          //If controller is not null
          if (newController != null){
            //Add listener to block and errorcontroller
            this.projectcontroller.getBlockController().addObserver(this.listener);
          }
      },
      deep: true,
    },
    show:{
      handler(newval:boolean, oldval: boolean){
        if (newval){
          this.newname = this.listener.getStartName();
        }
      }
    },
    project: {
      handler(newproj: Project, oldproj: Project) {
        oldproj.removeObserver(this.listener);
        newproj.addObserver(this.listener);
      }
    }
  },
})
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
.functionpopup {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}
.popupcontainer {
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

.submitbutton {
  margin-right: 60px;
  margin-top: 30px;
  margin: 5px;
  background-color: var(--basicbutton);
  border: 1px solid var(--basicbuttonbordercolor);
  border-radius: 10px;
  color: white;
  padding: 10px;
  width: 200px;
}
.submitbutton:hover {
  background-color: var(--basicbuttonhovercolor);
  cursor: pointer;
}
.popupitem {
  width: 100%;
}
input {
  margin: 5px;
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 15px;
  width: auto;
}
</style>
