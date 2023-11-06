<template>
  <div class="actionchoose">
    <div class="action">
      <input
        type="radio"
        name="action"
        @change="selectedAction = 'noAction'"
        checked="checked"
        ref="defaultaction"
      />
      Geen actie
    </div>
    <div class="action">
      <input type="radio" name="action" @change="radioNewBlock" />
      Nieuw blok
      <input placeholder="geef blok een naam" ref="newblockname" />
    </div>
    <div v-for="action in actions" :key="action[1]" class="action">
      <input type="radio" name="action" @change="selectedAction = action[1]" />
      {{ action[0] }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      actions: [
        ["Muis klik", "click"],
        ["Blok op canvas plaatsen", "addBlock"],
        ["Blok onderaan blok verbinden", "attachBlock"],
        ["Blok onderaan blok losmaken", "detachBlock"],
        ["Blok ertussen verbinden", "encloseBlock"],
        ["Blok ertussen losmaken", "detachEnclosedBlock"],
        ["Blok als input plaatsen", "inputBlock"],
        ["Blok uit input halen", "removeInputBlock"],
        ["Tekst schrijven", "writeText"]
      ] as [string, string][],
      selectedAction: "noAction"
    };
  },
  methods: {
    /**
     * Set the value of the newblock radio button
     */
    radioNewBlock() {
      this.selectedAction = "newBlock>";
    },
    /**
     * get selected action
     * @returns selected action string
     */
    getSelected(): string {
      let result = this.selectedAction;

      // if action new block, add block to string
      if (result == "newBlock>") {
        const blockname = this.$refs.newblockname.value;
        result = "newBlock>" + blockname;

        this.$emit("newblockref", blockname);
      }
      return result;
    },
    /**
     * resets action select to default options
     */
    reset() {
      (this.$refs.defaultaction as HTMLInputElement).checked = true;
      this.selectedAction = "noAction";
    }
  }
});
</script>

<style scoped>
.actionchoose {
  margin: 5px;
  border-radius: 15px;
  border: 1px solid white;
  width: 95%;
  padding: 5px;
}
</style>
