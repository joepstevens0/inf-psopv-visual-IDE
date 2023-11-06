import Block from "../../block/block";
import {
  AttachComponent,
  LabelComponent,
  ConnectComponent,
  ErrorComponent
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';

import colors from "@/assets/standardcolors.json"
const _color = (colors as any).functionblocks;

export class FunctionCallBlock extends Block {
    public constructor() {
      super("FunctionCall", _color);
      //Top
      this._connect = new ConnectComponent(this);
      this.addComponent(this._connect);
      //Bottom
      this._attach = new AttachComponent(this.getColor(), this);
      // add when activated
      //Base
      this._label = new LabelComponent(this);
      this._label.setText("Functie: ");
      this.addComponent(this._label);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
    }
    public execute(flowcontroller : FlowController): void {
      flowcontroller.startFunction(this._functionname,()=>{
        flowcontroller.setAction(this._attach.getNext());
      });
    }
  
    public setFunctionName(name: string){
      this._functionname = name;
      this._label.setText("Functie: " + name);
    }
  
    // Adds an attachComponent so the severed block can be used
    public activate() : void{
      this.addComponent(this._attach);
      this._isactive = true;
    }
 
    // Returns name of the function it calls
    public getFunctionName() : string {
      return this._functionname;
    }
  
    public save(): any{
      return {supersave: super.save(), isactive: this._isactive, functionname: this._functionname};
    }
  
    public load(data: any): Block{
      const d = data as {supersave: any, isactive: boolean, functionname: string};
      if(d.isactive)
        this.activate();
  
      super.load(d.supersave);
      
      this._isactive = d.isactive;
      this.setFunctionName(d.functionname);
      return this;
    }
  
    private _functionname = "";
    private _connect: ConnectComponent;
    private _attach: AttachComponent;
    private _label: LabelComponent;
    private _error: ErrorComponent;
    private _isactive = false;
  }