import Block from "../../block/block";
import {
  InputComponent,
  LabelComponent,
  ReturnComponent,
  ErrorComponent
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';

import colors from "@/assets/standardcolors.json"
const _color = (colors as any).logicblocks;

export class ANDBlock extends Block {
    public constructor() {
      super("AND", _color);
      //Base
      this._input1 = new InputComponent<boolean>(this, "boolean");
      this.addComponent(this._input1);

      this._label = new LabelComponent(this);
      this._label.setText("EN");
      this.addComponent(this._label);

      this._input2 = new InputComponent<boolean>(this, "boolean");
      this.addComponent(this._input2);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);

      this._return = new ReturnComponent<boolean>(this, "boolean");
      this.addComponent(this._return);
    }
    public execute(flowcontroller : FlowController): void {
        flowcontroller.setAction(this._input1.getBlock(), () => {flowcontroller.setAction(this._input2.getBlock(),() => {
            if (this._input1.getValue() && this._input2.getValue()) {
              this._return.setValue(true);
            } else this._return.setValue(false);
            flowcontroller.setAction(null);
        })});
    }
  
    private _label: LabelComponent;
    private _input1: InputComponent<boolean>;
    private _input2: InputComponent<boolean>;
    private _return: ReturnComponent<boolean>;
    private _error: ErrorComponent;
}