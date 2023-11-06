import Block from "../../block/block";
import {
  InputComponent,
  LabelComponent,
  ReturnComponent,
  BreakComponent,
  ErrorComponent
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';
import Logger from '@/util/logger';

import colors from "@/assets/standardcolors.json"
import { GhostBlock } from '../basicblocks/basicblocks';
const _color = (colors as any).stringblocks;

export class ConcatBlock extends Block {
    public constructor() {
      super("Concat", _color);
      //Base
      this._label = new LabelComponent(this);
      this._label.setText("Voeg tekst samen: ");
      this.addComponent(this._label);
  
      this.addComponent(new BreakComponent(this));
  
      this._input1 = new InputComponent<any>(this, "any");
      this._input1.setDefault(new GhostBlock());  
      this.addComponent(this._input1);
  
      this._input2 = new InputComponent<any>(this, "any");
      this._input2.setDefault(new GhostBlock());  
      this.addComponent(this._input2);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
  
      this._return = new ReturnComponent<string>(this, "string");
      this.addComponent(this._return);
    }
    public execute(flowcontroller : FlowController): void {
        flowcontroller.setAction(this._input1.getBlock(), () => {flowcontroller.setAction(this._input2.getBlock(),() => {
            //this._return.setValue((this._input1.getValue() as string)?.concat(this._input2.getValue() as string));
            //flowcontroller.setAction(null);

          // If there is input
          if (this._input1.hasValue() && this._input2.hasValue()){
            this._return.setValue((this._input1.getValue() as string + "").concat(this._input2.getValue() as string + ""));

          // Else throw error
          } else {
            // error that gets caught: no input
            // How to solve: check if input.

            // Create function that checks if said error is solved:
            const solveparam = [this._input1, this._input2];
            const solvefunc = function(param: any[]) : boolean {
                const comp1 = param[0];
                const comp2 = param[1];

                if ( comp1.hasValue() && comp2.hasValue() ){
                  return true;
                } else {
                  return false;
                }
            };

            //Add error to errorlist
            this._error.addError(["ERROR", "Er is geen input meegegeven.", solvefunc, solveparam]);
            Logger.error("ConcatBlock error:", this._input1, "or", this._input2, "is empty");
          } 

          flowcontroller.setAction(null);

        })});
    }
  
    private _label: LabelComponent;
    private _input1: InputComponent<any>;
    private _input2: InputComponent<any>;
    private _return: ReturnComponent<string>;
    private _error: ErrorComponent;
  }