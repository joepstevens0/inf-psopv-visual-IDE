<template>
  <div class="targetchoose">
    <div class="basictargets">
      <div class="highlightoption">
        <input
          type="radio"
          name="highlight"
          @change="selectedHighlight = 'noTarget'"
          checked="checked"
          ref="defaulttarget"
        />
        Geen
      </div>
      <div
        v-for="target in basictargets"
        :key="target[1]"
        class="highlightoption"
      >
        <input
          type="radio"
          name="highlight"
          @change="selectedHighlight = target[1]"
          :value="target[1]"
        />
        {{ target[0] }}
      </div>
    </div>
    <div class="highlightoption">
      <input type="radio" name="highlight" @change="radioListblock" />
      Blok uit blokkenlijst
      <select ref="blocklistblockselect"
        ><option v-for="key in blocks.keys()" :key="key">{{
          key
        }}</option></select
      >
    </div>
    <div class="highlightoption" v-if="namedblocks.length > 0">
      <input type="radio" name="highlight" @change="radioNamedBlock" />
      <select
        ref="blocktargets"
        @change="setSelectedParts($event.target.value)"
      >
        <option
          class="blocktarget"
          v-for="(name, index) in namedblocks"
          :key="name"
          :value="index"
          >{{ name }}
        </option>
      </select>
      <select
        name="blockpart"
        placeholder="deel van blok"
        ref="blockpartselect"
      >
        <option value="noPart">Hele blok</option>
        <option v-for="part in selectedParts" :key="part" :value="part">
          {{ part }}
        </option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import Block from "@/datastructures/block/block";

export default Vue.extend({
  props: {
    blocklist: {
      required: true
    }
  },
  data() {
    return {
      basictargets: [
        ["Canvas", "canvas"],
        ["Blokkenlijst", "blocklistContainer"],
        ["Tekst venster", "console1"],
        ["Afbeeldingen venster", "imagecanvas"],
        ["Variabelen venster", "variableview"],
        ["Startknop", "startknop"],
        ["Stopknop", "stopknop"],
        ["Stapknop", "stepknop"],
        ["Undoknop", "undoknop"],
        ["Redoknop", "redoknop"]
      ] as [string, string][],
      selectedHighlight: "noTarget",
      selectedParts: [] as string[],
      blocks: new Map(),
      namedblocks: [] as string[],
      namedblockparts: [] as string[][]
    };
  },
  methods: {
    /**
     * set the value for named block radio
     */
    radioNamedBlock() {
      this.selectedHighlight = "block>";
    },
    /**
     * set the value for listblock radio
     */
    radioListblock() {
      this.selectedHighlight = "blocklist>";
    },
    /**
     * set the value for block part selection
     */
    setSelectedParts(index: number) {
      this.selectedParts = this.namedblockparts[index];
    },
    /**
     * get selected target
     * @returns selected target string
     */
    getSelected(): string {
      let result = this.selectedHighlight;

      // if blocklist element, add chosen block to string
      if (result == "blocklist>") {
        const targets = this.$refs.blocklistblockselect as HTMLSelectElement;
        result = "blocklist>" + targets.options[targets.selectedIndex].value;
      }

      // if canvas block, add chosen block reference to string and selected block part
      if (result == "block>") {
        const namedblocks = this.$refs.blocktargets as HTMLSelectElement;
        const blockname = namedblocks.options[namedblocks.selectedIndex].text;
        const partstring = this.$refs.blockpartselect.options[
          this.$refs.blockpartselect.selectedIndex
        ].value;
        result =
          "block>" +
          blockname +
          (partstring != "noPart" ? ">" + partstring : "");
      }
      return result;
    },
    /**
     * reset target select to default options
     */
    reset() {
      (this.$refs.defaulttarget as HTMLInputElement).checked = true;
      this.selectedHighlight = "noTarget";
    },
    /**
     * add a block reference
     * @post blockname and selected highlight target block is added to the reference list
     */
    addBlockRef(refname: string, blockname = "") {
      let highlightedblock = blockname;
      if (highlightedblock == "") {
        // get selected block
        const targets = this.$refs.blocklistblockselect as HTMLSelectElement;
        highlightedblock = targets.options[targets.selectedIndex].value;
      }

      // search if block already in reference list
      let found = 1;
      let alreadyused = true;
      let finalrefname = refname;
      while (alreadyused) {
        alreadyused = false;
        for (let i = 0; i < this.namedblocks.length; ++i) {
          if (this.namedblocks[i] == finalrefname) {
            alreadyused = true;
            finalrefname = refname + ++found; // if block already in list, add number to name
          }
        }
      }

      // add block to reference list
      this.namedblocks.push(finalrefname);

      // add parts of block to parts list
      this.namedblockparts.push(this.blocks.get(highlightedblock));

      // set selected part to 0 if only 1 part
      if (this.namedblocks.length == 1) {
        this.setSelectedParts(0);
      }
    },
    /**
     * clear block references
     * @post blockreference list is empty
     */
    clear() {
      this.namedblocks = [];
    }
  },
  watch: {
    blocklist: {
      /**
       * set blocklist block options when list changes
       */
      handler(newval, oldval) {
        if (this.blocklist == undefined) return;
        Vue.nextTick(() => {
          this.blocks.clear();

          // iterate over every categorie
          for (let i = 0; i < this.blocklist.categories.length; ++i) {
            const cat = this.blocklist.categories[i];

            // for every block in categorie
            for (let j = 0; j < cat.Blocks.length; ++j) {
              const block: Block = cat.Blocks[j];

              // add blockcomponents in a map combined with number representing amount
              const parts = new Map();
              for (let k = 0; k < block.nComponents(); ++k) {
                let compname = block.getNComponent(k).getName();
                if (compname.startsWith("Input")) compname = "Input";
                if (compname.startsWith("Return")) compname = "Return";
                if (parts.has(compname))
                  parts.set(compname, parts.get(compname) + 1);
                else parts.set(compname, 0);
              }

              // convert blockcomponent map in string list with components name and number
              const l = [];
              for (const key of parts.keys()) {
                for (let i = 0; i < parts.get(key) + 1; ++i) {
                  l.push(String(key).toLowerCase() + "view#" + i.toString());
                }
              }

              // add reference
              this.blocks.set(block.getName(), l);
            }
          }
          // force update for list update
          this.$forceUpdate();
        });
      },
      immediate: true
    }
  }
});
</script>

<style scoped>
.targetchoose {
  margin: 5px;
  border-radius: 15px;
  border: 1px solid white;
  width: 95%;
  padding: 5px;
}
</style>
