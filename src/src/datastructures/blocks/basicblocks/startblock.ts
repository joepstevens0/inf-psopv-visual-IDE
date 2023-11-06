import Block from "../../block/block";
import {
  StartComponent,
  AttachComponent,
  LabelComponent,
  // ErrorComponent
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';

import colors from "@/assets/standardcolors.json"
const _color = (colors as any).startblocks;

export class StartBlock extends Block {
    public constructor() {
      super("Start", _color);
      //Top
      this._start = new StartComponent(this.getColor(), this);
      this._start.setValidator((info: string)=> {return info == "start";})
      this.addComponent(this._start);
      //Bottom
      this._attach = new AttachComponent(this.getColor(), this);
      this.addComponent(this._attach);
      //Base
      this._label = new LabelComponent(this);
      this._label.setText("Start");
      this.addComponent(this._label);

      // this._error = new ErrorComponent(this);
      // this.addComponent(this._error);
    }
    public execute(flowcontroller : FlowController): void {
      flowcontroller.setAction(this._attach.getNext());
    }
    private _start: StartComponent;
    private _attach: AttachComponent;
    private _label: LabelComponent;
    // private _error: ErrorComponent;
  }