<script lang="ts">
import Vue from "vue";
import BlockComponent from "@/datastructures/block/blockcomponents/blockcomponents";

import LabelView from "./labelview.vue";
import StartView from "./startview.vue";
import ConnectView from "./connectview.vue";
import AttachView from "./attachview.vue";
import InputView from "./inputview.vue";
import EnclosureView from "./enclosureview.vue";
import CommentView from "./commentview.vue";
import APIConnectView from "./apiconnectview.vue";
import APIAttachView from "./apiattachview.vue";
import APIEnclosureView from "./apienclosureview.vue";
import ChoiceView from "./choiceview.vue";
import ErrorView from "./errorview.vue";
import ButtonView from "./buttonview.vue";
import ProjectController from "@/datastructures/controllers/projectcontroller";


export interface ComponentViewData {
  component: BlockComponent;
  x: number;
  y: number;
  w: number;
  h: number;
  pos: string;
}

export default Vue.extend({
  props: {
    componentdata: {
      type: Object as () => ComponentViewData,
      required: true
    },
    _projectcontroller: {
      class: ProjectController,
      required: false
    }
  },

  methods: {
    /**
     * change height of component
     */
    updateHeight: function(h: number) {
      this.componentdata.h = h;
      this.$emit("dataUpdate", this.componentdata);
    },
    /**
     * change width of component
     */
    updateWidth: function(w: number) {
      this.componentdata.w = w;
      this.$emit("dataUpdate", this.componentdata);
    },
    /**
     * change position of component
     */
    setPos: function(p: string) {
      this.componentdata.pos = p;
      this.$emit("dataUpdate", this.componentdata);
    }
  },

  /**
   * renders the correct component
   */
  render: function(createElement) {
    let name = this.componentdata.component.getName();
    if (this.componentdata.component.getName().startsWith("Return")){
      name = "Return";
    }
    if (this.componentdata.component.getName().startsWith("Input")){
      name = "Input";
    }

    const c = createElement(name + "View", {
      on: {
        heightUpdate: this.updateHeight,
        widthUpdate: this.updateWidth,
        setPos: this.setPos
      },
      props: { component: this.componentdata.component , controller: this._projectcontroller}
    });
    return createElement(
      "g",
      {
        attrs: {
          transform:
            "translate(" +
            this.componentdata.x.toString() +
            "," +
            this.componentdata.y.toString() +
            ")"
        }
      },
      [c]
    );
  },

  components: {
    LabelView,
    StartView,
    ConnectView,
    AttachView,
    InputView,
    EnclosureView,
    CommentView,
    APIConnectView,
    APIAttachView,
    APIEnclosureView,
    ChoiceView,
    ErrorView,
    ButtonView
  }
});
</script>
