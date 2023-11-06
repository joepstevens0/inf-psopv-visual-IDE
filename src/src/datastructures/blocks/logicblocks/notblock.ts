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

export class NOTBlock extends Block {
    public constructor() {
      super("NOT", _color);
      //Base
      this._label = new LabelComponent(this);
      this._label.setText("NIET");
      this.addComponent(this._label);

      this._input = new InputComponent<boolean>(this, "boolean");
      this.addComponent(this._input);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);

      this._return = new ReturnComponent<boolean>(this, "boolean");
      this.addComponent(this._return);
    }
    public execute(flowcontroller : FlowController): void {
        flowcontroller.setAction(this._input.getBlock(), () => {
            this._return.setValue(!(this._input.getValue()));
            flowcontroller.setAction(null);
        });
    }
  
    private _label: LabelComponent;
    private _input: InputComponent<boolean>;
    private _return: ReturnComponent<boolean>;
    private _error: ErrorComponent;
}