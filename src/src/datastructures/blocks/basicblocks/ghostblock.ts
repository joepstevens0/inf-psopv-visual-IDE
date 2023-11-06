import Block from "../../block/block";
import {
  ReturnComponent,
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';


export class GhostBlock extends Block {
    public constructor() {
      super("Ghost", "#FFFFFF");
  
      this._return = new ReturnComponent<string>(this, "string");
      this.addComponent(this._return);
      this._return.setValue("");
    }
    public execute(flowcontroller : FlowController): void {
      flowcontroller.setAction(null);
    }
  
    private _return: ReturnComponent<string>;
  }