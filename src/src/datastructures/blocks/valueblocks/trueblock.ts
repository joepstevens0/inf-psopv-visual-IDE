import Block from "../../block/block";
import {
  LabelComponent,
  ReturnComponent,
  ErrorComponent
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';

import colors from "@/assets/standardcolors.json"
const _color = (colors as any).valueblocks;

export class TrueBlock extends Block {
    public constructor() {
      super("True", _color);

      //Base
      this._label = new LabelComponent(this);
      this._label.setText("Waar");
      this.addComponent(this._label);
  
      this._return = new ReturnComponent<boolean>(this, "boolean");
      this.addComponent(this._return);
      this._return.setValue(true);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
    }
    public execute(flowcontroller : FlowController): void {
      flowcontroller.setAction(null);
    }
  
    private _label: LabelComponent;
    private _return: ReturnComponent<boolean>;
    private _error: ErrorComponent;
}