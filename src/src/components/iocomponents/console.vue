<template>
  <div class="console">
    <div class="header">
      <button class="basicbutton" v-on:click="clear">herstel</button>
      Tekst
    </div>
    <ul class="consolemessages" ref="messagelist">
      <li
        class="consoleMessage"
        v-for="(message, index) in messages"
        v-bind:key="index"
      >
        {{ message }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Project from "@/datastructures/project/project";
import { Observer } from "@/util/observer";

class PrintListener implements Observer {
  update(message: any) {
    if (typeof message == "string") {
      const m = message as string;
      if (m.split(":")[0] == "print") {
        let newmes = m.substring(m.indexOf(":") + 1);
        if (newmes.trim() == "undefined" || newmes.trim() == "") newmes = "";
        this.messages.push(newmes);
      }
    }
  }

  public getMessages(): string[] {
    return this.messages;
  }
  public clear() {
    this.messages = [];
  }

  private messages: string[] = [];
}

export default Vue.extend({
  props: {
    project: {
      type: Project,
      required: true,
    }
  },
  data() {
    return {
      listener: new PrintListener()
    };
  },
  computed: {
    messages(): string[] {
      return this.listener.getMessages();
    }
  },
  methods: {
    /**
     * scroll to the bottom of the console
     */
    scrollToEnd() {
      const el = this.$el.getElementsByClassName("consolemessages")[0];
      el.scrollTop = el.scrollHeight;
    },
    /**
     * remove all messages from the console
     */
    clear() {
      this.listener.clear();
    }
  },
  updated() {
    this.scrollToEnd();
  },
  watch: {
    project: {
      handler(newval: Project, oldval: Project) {
        if (oldval == newval) return;
        if (newval != null) newval.addObserver(this.listener);

        if (oldval != null) oldval.removeObserver(this.listener);
      },
      immediate: true
    }
  }
});
</script>

<style scoped>
.consoleMessage {
  list-style-type: none;
  padding: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid black;
}
.console {
  background-color: var(--backgroundcolor);
  margin-left: 5px;
  margin-bottom: 5px;
  /*width: 98%;
  height: 100%;*/
  border: 1px solid black;
  clear: both;
}
.consolemessages {
  border-top: 1px solid black;
  padding: 0;
  margin: 0;
  height: calc(100% - 41px);
  overflow-y: scroll;
  white-space: pre;
  user-select: text;
}

@import url(../../assets/basicbutton.css);

.header {
  color: white;
  background-color: var(--ioheadercolor);
}
</style>
