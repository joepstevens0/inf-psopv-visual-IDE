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

export class IndexBlock extends Block {
    public constructor() {
      super("Index", _color);
      //Base
      this._label = new LabelComponent(this);
      this._label.setText("Neem letter op plaats:");
      this.addComponent(this._label);
  
      // this.addComponent(new BreakComponent(this));
  
      this._input1 = new InputComponent<number>(this, "number");
      this._input1.setDefault(new GhostBlock());  
      this.addComponent(this._input1);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
  
      this.addComponent(new BreakComponent(this));
  
      this._label2 = new LabelComponent(this);
      this._label2.setText("van tekst:");
      this.addComponent(this._label2);
  
      // this.addComponent(new BreakComponent(this));
  
      this._input2 = new InputComponent<string>(this, "string");
      this._input2.setDefault(new GhostBlock());  
      this.addComponent(this._input2);
  
      this._return = new ReturnComponent<string>(this, "string");
      this.addComponent(this._return);
    }
    public execute(flowcontroller : FlowController): void {
        flowcontroller.setAction(this._input1.getBlock(), () => {flowcontroller.setAction(this._input2.getBlock(),() => {

          // If there is input
          if (this._input1.hasValue() && this._input2.hasValue()){
            // If index is valid, get char
            if ( (this._input1.getValue() as number >= 0) && (this._input1.getValue() < (this._input2.getValue() as string).length) ){
              this._return.setValue((this._input2.getValue() as string).charAt(this._input1.getValue() as number));

            // Else throw error
            } else {
              // error that gets caught: invalid index
              // How to solve: check if valid index.

              // Create function that checks if said error is solved:
              const solveparam = [this._input1, this._input2];
              const solvefunc = function(param: any[]) : boolean {
                  const comp1 = param[0];
                  const comp2 = param[1];

                  if ( (comp1.getValue() as number >= 0) && (comp1.getValue() < (comp2.getValue() as string).length) ){
                    return true;
                  } else {
                    return false;
                  }
              };

              //Add error to errorlist
              this._error.addError(["ERROR", "Deze plaats is niet geldig.", solvefunc, solveparam]);
              Logger.error("IndexBlock error:", this._input1.getValue(), "is not a valid index for", this._input2.getValue());
            } 

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
            Logger.error("IndexBlock error:", this._input1, "or", this._input2, "is empty");
          } 

          flowcontroller.setAction(null);

        })});
    }
  
    private _label: LabelComponent;
    private _label2: LabelComponent;
    private _input1: InputComponent<number>;
    private _input2: InputComponent<string>;
    private _return: ReturnComponent<string>;
    private _error: ErrorComponent;
  }