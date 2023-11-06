import Block from "../../block/block";
import {
  ConnectComponent,
  AttachComponent,
  InputComponent,
  LabelComponent,
  ErrorComponent
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';

import colors from "@/assets/standardcolors.json"
import { GhostBlock } from '../basicblocks/basicblocks';
const _color = (colors as any).stringblocks;


export class PrintBlock extends Block {
    public constructor() {
      super("Print", _color);
      //Top
      this._connect = new ConnectComponent(this);
      this.addComponent(this._connect);
      //Bottom
      this._attach = new AttachComponent(this.getColor(), this);
      this.addComponent(this._attach);
      //Base
      this._label = new LabelComponent(this);
      this._label.setText("Toon tekst");
      this.addComponent(this._label);
      
      this._input = new InputComponent<any>(this, "any");
      this._input.setDefault(new GhostBlock());    
      this.addComponent(this._input);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
    }
    public execute(flowcontroller : FlowController): void {
      flowcontroller.setAction(this._input.getBlock(), () => {
        const val = this._input.getValue();
        if (val == undefined || val == ""){
          this._error.addError(["WARNING", "Print-blok is leeg.", ()=>{const val = this._input.getValue(); return val != undefined && val != "";}, []]);
        }
        this.notifyObservers("print:" + this._input.getValue());
        flowcontroller.setAction(this._attach.getNext());
      });
    }
  
    private _input: InputComponent<any>;
    private _attach: AttachComponent;
    private _label: LabelComponent;
    private _connect: ConnectComponent;
    private _error: ErrorComponent;
  }
  