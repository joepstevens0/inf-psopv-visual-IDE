<template>
    <!-- Only show component when needed -->
    <!-- g is needed because the components will be added to svg figures -->
    <g class="errorview" v-if="_componentneeded" v-on:mouseover="mouseOver()" v-on:mouseleave="mouseLeave()">

        <!-- Show icon depending on type of message -->
        <foreignObject x="-15" y="0" width="30" height="30">
            <img draggable="false" :src="_image" alt="Erroricon" class="erroricon">
        </foreignObject>

        <!-- Message gets a different foreignobject, otherwise it will be detectable with the cursor -->
        <foreignObject v-if="messageactive" x="0" y="0" width="200" :style='"height:"+messageDivHeight'>
            <div ref="messagediv" class="err" :style='"background: "+_backgroundcolor+"; border: 2px solid "+_bordercolor'>
                <div class="errortext">{{ _type }}</div>
                <div class="errortext">{{ _message }}</div>
            </div>
        </foreignObject>
    </g>
</template>

<script lang="ts">
import Vue from "vue";
import { ErrorComponent } from "@/datastructures/block/blockcomponents/blockcomponents.ts";

export default Vue.extend({
  props: {
    component: {
      type: ErrorComponent,
      required: true
    },
  },
  data() {
    return {
        messageactive: false,
        messageDivHeight: 0
    }
  },
  computed: {
    //   Returns true if the component needs to be shown
    _componentneeded(): boolean {
        return this.component.errorCount() > 0;
     },
    //  Checks which icon needs to be shown
    _image(): string {
        const type = this.component.getFirstError()[0];
        if (type == "ERROR") {
            return require("@/assets/img/erroricons/error-5-24.png");
        } else if (type == "WARNING") {
            return require("@/assets/img/erroricons/alert-24.png");
        } else if (type == "SUCCES") { 
            return require("@/assets/img/erroricons/ok-24.png");
        } else {
            return "Not visible";
        }
    },
    // Returns the type of the message: ERROR / WARNING / SUCCES
    _type(): string {
        if (this.component.getFirstError() != ["-1", "-1", function(param : any[]) : boolean {return false}]) {
            if (this.component.getFirstError()[0] == "ERROR") {
                return "Fout";
            } else if (this.component.getFirstError()[0] == "WARNING") {
                return "Waarschuwing";
            } else {
                return this.component.getFirstError()[0];
            }
        } else {
            return "No type";
        }
    },
    // Returns the message
    _message(): string {
        if (this.component.getFirstError() != ["-1", "-1", function(param : any[]) : boolean {return false}]) {
            return this.component.getFirstError()[1];
        } else {
            return "No message";
        }
    },
    // Returns the backgroundcolor of the messagebox as a string
    _backgroundcolor() : string {
        const type = this.component.getFirstError()[0];
        if (type == "ERROR") {
            return "var(--errorbackgroundcolor)";
        } else if (type == "WARNING") {
            return "var(--warningbackgroundcolor)";
        } else if (type == "SUCCES") { 
            return "var(--succesbackgroundcolor)";
        } else {
            return "Not visible";
        }
    },
    // Returns the bordercolor of the messagebox as a string
    _bordercolor() : string {
        const type = this.component.getFirstError()[0];
        if (type == "ERROR") {
            return "var(--errorbordercolor)";
        } else if (type == "WARNING") {
            return "var(--warningbordercolor)";
        } else if (type == "SUCCES") { 
            return "var(--succesbordercolor)";
        } else {
            return "Not visible";
        }
    }
  },
  mounted() {
    //Init component
    this.sendHeight(-10);
    this.sendWidth(-10);
    this.$emit("setPos", "base");
  },
  methods: {
    sendHeight: function(h: number) {
      this.$emit("heightUpdate", h);
    },
    sendWidth: function(w: number) {
      this.$emit("widthUpdate", w);
    },
    mouseOver: function(){
      if (typeof this.$refs.messagediv != 'undefined') {
        this.messageDivHeight = this.$refs.messagediv.getBoundingClientRect().height;
      }
      this.messageactive = true;
    },
    mouseLeave: function(){
      this.messageactive = false;
    },
  }
});
</script>

<style scoped>
.erroricon {
    -webkit-filter: drop-shadow(0.5px 0.5px 0.5px #222);
    filter: drop-shadow(0.5px 0.5px 0.5px #222); 
}
.erroricon:hover {
    cursor: default;
}
.errortext {
    color: white;
    padding: 10px;
    word-wrap: break-word;
    font-family: Arial, Helvetica, sans-serif;
    text-shadow:
    -0.5px -0.5px 0 #000,  
    0.5px -0.5px 0 #000,
    -0.5px 0.5px 0 #000,
    0.5px 0.5px 0 #000;
}
.err{
    border-radius: 15px;
}
</style>