<template>
<div class="pw">
    <!-- Create Grid container -->
    <div class="passwordgrid">
        <!-- Create 9 divs -->
        <div
            v-for="n in numgriditems"
            v-bind:key="n"
            class="grid-item"
            :class="{selected: selectedItems[n-1]}"
            @click="itemClicked(n)"
        >
        </div> 
    </div>

    <!-- Create explanation -->
    <div class="explanation">
      <!-- Create Icon -->
      <img draggable="false" src="@/assets/img/info-2-48.png" alt="ExplanationIcon" v-on:mouseover="showExplanation()" v-on:mouseleave="hideExplanation()">
      <!-- Create Text -->
      <div v-show="showExpl" class="expl">
          <div class="expltext">Kies een wachtwoord door een aantal vakjes blauw te maken. Dit kan je doen door op een vakje te klikken. Minstens 1 vakje moet blauw gemaakt worden.</div>
      </div>
    </div>

</div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  props: {},
  data() {
    return {
      numgriditems: 9,
      password: "",
      selectedItems: [],      
      showExpl: false,
    };
  },

  methods: {
    // Handles everything when a grid-item is pressed.
    itemClicked(index: number) : void {
        //Change color of div
        // Use $set to automatically update the view
        this.$set(this.selectedItems, index-1, !this.selectedItems[index-1]);

        //replace char on index from password
        let replace = "";
        if (this.password.charAt(index-1) == "0"){
            replace = "1";
        } else {
            replace = "0";
        }

        // Update password
        this.password = this.password.substr(0, index-1) + replace + this.password.substr(index-1 + 1);        
    },

    // Returns true if grid-item is selected
    isSelected(index: number) : boolean {
        return this.selectedItems[index-1];
    },

    // Returns password
    getPassword() : string {
      return this.password;
    },

    // Clears the passwordgrid
    clear() : void {
      this.password = "";
      for (let i = 0; i < this.numgriditems; i++) {
          this.password = this.password + "0";
          this.$set(this.selectedItems, i, false);
      }
    },

    // Shows explanation of passwordgrid
    showExplanation() : void {
      this.showExpl = true;
    },

    // Hides explanation of passwordgrid
    hideExplanation() : void {
      this.showExpl = false;
    }
  },

  mounted() {
    // init empty password and selectedItems array
    for (let i = 0; i < this.numgriditems; i++) {
        this.password = this.password + "0";
        this.selectedItems.push(false);
    }
  },
});
</script>

<style>
.pw {
  display: flex;
}

.passwordgrid {
  width: 40%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  border-radius: 10px;
  margin: 1%;
  padding: 1%;
  background: var(--headercolor);
  border: 1px solid var(--headerbordercolor);
}

.grid-item {
  flex: 1 1 32%; /* adjust flex-grow, flex-shrink, and flex-basis */
  height: 50px;
  margin: 0.3%;
  background-color: #999;
  cursor: pointer;
  border-radius: 10px;
  border: 0.1px solid var(--headerbordercolor);
}

.grid-item:active {
    -moz-box-shadow: inset 0 0 10px #000000;
    -webkit-box-shadow: inset 0 0 10px #000000;
    box-shadow: inset 0 0 10px #000000;
}

.selected {
    background-color: #0387da;
}

.explanation {
  margin-bottom: auto;
  margin-top: auto;
  width: 60%;
}

.expl{
    border-radius: 15px;
    background: var(--headercolor);
     border: 2px solid var(--headerbordercolor);
}

.expltext {
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
</style>