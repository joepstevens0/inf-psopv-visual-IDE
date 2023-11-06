import Block from "../../block/block";
import {
  StartComponent,
  AttachComponent,
  EnclosureComponent,
  LabelComponent,
  ErrorComponent,
  ButtonComponent
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';

import colors from "@/assets/standardcolors.json"
import { FunctionCallBlock } from './functioncallblock';
const _color = (colors as any).functionblocks;

export class FunctionEncloseBlock extends Block {
    public constructor() {
      super("FunctionEnclose", _color);
      this._functionname = "";

      //Top
      this._start = new StartComponent(this.getColor(), this);
      this.addComponent(this._start);
      //Bottom
      this._enclose = new EnclosureComponent(this.getColor(), this);
      this.addComponent(this._enclose);
      
      this._attach = new AttachComponent(this.getColor(),this);
      this.addComponent(this._attach);
      this.attachCallBlock();
      //Base
      this._label = new LabelComponent(this);
      this._label.setText("Functie: " + this._functionname);
      this.addComponent(this._label);

      this._button = new ButtonComponent(this);
      this._button.setText("Verander naam");
      this._button.setFunction( () => {this.notifyObservers(["FunctionEnclose namechange:" + this._functionname, this])} );
      this.addComponent(this._button);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
    }

    public execute(flowcontroller : FlowController): void {
      flowcontroller.setAction(this._enclose.getFirstBlock(), () => {
        flowcontroller.setAction(null);
      });
    }
  
    // Attaches a FunctionCall block to this block.
    public attachCallBlock(){
      const b: FunctionCallBlock = new FunctionCallBlock();
      b.setFunctionName(this._functionname);
      this._attach.setNext(b);
    }

    // Returns name of the function
    public getFunctionName(): string{
      return this._functionname;
    }

    //Sets _functionname
    public setFunctionName(name: string): void {
      this._functionname = name;
      this._label.setText("Functie: " + this._functionname);
      const callblock = this._attach.getNext() as FunctionCallBlock;
      callblock.setFunctionName(name);
    }

    // Changes name of function.
    public changeFunctionName(name: string) : void {
      const oldname = this._functionname;

      //Update name of this FunctionEnclose Block
      this.setFunctionName(name);
      this._label.setText("Functie: " + this._functionname);

      // Update name of FunctionCall Block hanging to this FunctionEnclose
      const callblock = (this._attach.getNext() as FunctionCallBlock | null);
      callblock?.setFunctionName(name);

      // Change name for every callBlock of this function
      this.notifyObservers(["changeCallBlocks", oldname, name]);
    }

    public save(): any{
      return {supersave: super.save(), functionname: this._functionname};
    }
  
    public load(data: any): Block{
      super.load(data.supersave);
      this._functionname = data.functionname;
      this._label.setText("Functie " + this._functionname);
      this.attachCallBlock();
      return this;
    }

    public isFirst(): boolean {
      if (this._isFirst) {
        this._isFirst = false;
        return true;
      }
      return false;
    }

    private _functionname: string;
    private _enclose: EnclosureComponent;
    private _start: StartComponent;
    private _label: LabelComponent;
    private _attach: AttachComponent;
    private _error: ErrorComponent;
    private _button: ButtonComponent;
    private _isFirst = true;
}