import Block from "../../block/block";
import {
  InputComponent,
  LabelComponent,
  ReturnComponent,
  ErrorComponent
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';

import colors from "@/assets/standardcolors.json"
import { GhostBlock } from '../basicblocks/basicblocks';
const _color = (colors as any).mathblocks;

export class GreaterThanBlock extends Block {
    public constructor() {
      super("GreaterThan", _color);
      this._input1 = new InputComponent<number>(this, "number");
      this._input1.setDefault(new GhostBlock());
      this.addComponent(this._input1);
      this._label = new LabelComponent(this);
      this._label.setText(">");
      this.addComponent(this._label);
      this._input2 = new InputComponent<number>(this, "number");
      this._input2.setDefault(new GhostBlock());
      this.addComponent(this._input2);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
  
      this._return = new ReturnComponent<boolean>(this, "boolean");
      this.addComponent(this._return);
    }
    public execute(flowcontroller : FlowController): void {
      flowcontroller.setAction(this._input1.getBlock(), () => {flowcontroller.setAction(this._input2.getBlock(),() => {
        this._return.setValue((this._input1.getValue() as number) > (this._input2.getValue() as number));
        flowcontroller.setAction(null);
      })});
    }
  
    private _input1: InputComponent<number>;
    private _label: LabelComponent;
    private _input2: InputComponent<number>;
    private _return: ReturnComponent<boolean>;
    private _error: ErrorComponent;
  }
