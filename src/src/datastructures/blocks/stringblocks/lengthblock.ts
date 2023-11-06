import Block from "../../block/block";
import {
  InputComponent,
  LabelComponent,
  ReturnComponent,
  BreakComponent,
  ErrorComponent
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';
import Logger from "@/util/logger";

import colors from "@/assets/standardcolors.json"
import { GhostBlock } from '../basicblocks/basicblocks';
const _color = (colors as any).stringblocks;


export class LengthBlock extends Block {
    public constructor() {
      super("Length", _color);
      //Base
      this._label = new LabelComponent(this);
      this._label.setText("Bereken lengte van: ");
      this.addComponent(this._label);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
  
      this.addComponent(new BreakComponent(this));
  
      this._input1 = new InputComponent<string>(this, "string");
      this._input1.setDefault(new GhostBlock());  
      this.addComponent(this._input1);
  
      this._return = new ReturnComponent<number>(this, "number");
      this.addComponent(this._return);
    }
    public execute(flowcontroller : FlowController): void {
        flowcontroller.setAction(this._input1.getBlock(), () => {
          // If there is input
          if (this._input1.hasValue()){
            this._return.setValue((this._input1.getValue() as string).length);

          // Else throw error
          } else {
            // error that gets caught: no input
            // How to solve: check if input.

            // Create function that checks if said error is solved:
            const solveparam = [this._input1];
            const solvefunc = function(param: any[]) : boolean {
                const comp = param[0];

                if ( comp.hasValue() ){
                  return true;
                } else {
                  return false;
                }
            };

            //Add error to errorlist
            this._error.addError(["ERROR", "Er is geen input meegegeven.", solvefunc, solveparam]);
            Logger.error("LengthBlock error:", this._input1, "is empty");
          } 

          flowcontroller.setAction(null);
        });
    }
  
    private _label: LabelComponent;
    private _input1: InputComponent<string>;
    private _return: ReturnComponent<number>;
    private _error: ErrorComponent;
  }