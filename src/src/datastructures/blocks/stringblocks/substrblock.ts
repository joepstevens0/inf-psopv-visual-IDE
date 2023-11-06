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

export class SubstrBlock extends Block {
    public constructor() {
      super("Substr", _color);
      //Base
      this._label = new LabelComponent(this);
      this._label.setText("Neem deel van tekst Start:");
      this.addComponent(this._label);
  
      this._input1 = new InputComponent<number>(this, "string");
      this._input1.setDefault(new GhostBlock());  
      this.addComponent(this._input1);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
  
      this.addComponent(new BreakComponent(this));
  
      this._label2 = new LabelComponent(this);
      this._label2.setText("Lengte:");
      this.addComponent(this._label2);
  
      this._input2 = new InputComponent<number>(this, "string");
      this._input2.setDefault(new GhostBlock());  
      this.addComponent(this._input2);
  
      this.addComponent(new BreakComponent(this));
  
      this._label3 = new LabelComponent(this);
      this._label3.setText("van tekst:");
      this.addComponent(this._label3);
  
      this._input3 = new InputComponent<string>(this, "string");
      this._input3.setDefault(new GhostBlock());  
      this.addComponent(this._input3);
  
      this._return = new ReturnComponent<string>(this, "string");
      this.addComponent(this._return);
    }
    public execute(flowcontroller : FlowController): void {
        flowcontroller.setAction(this._input1.getBlock(), () => {flowcontroller.setAction(this._input2.getBlock(),() => {flowcontroller.setAction(this._input3.getBlock(),() => {
          // If there is input
          if (this._input1.hasValue() && this._input2.hasValue() && this._input3.hasValue()){
            this._return.setValue((this._input3.getValue() as string).substr(this._input1.getValue() as number, this._input2.getValue() as number));
            flowcontroller.setAction(null);

          // Else throw error
          } else {
            // error that gets caught: no input
            // How to solve: check if input.

            // Create function that checks if said error is solved:
            const solveparam = [this._input1, this._input2, this._input3];
            const solvefunc = function(param: any[]) : boolean {
                const comp1 = param[0];
                const comp2 = param[1];
                const comp3 = param[2];

                if ( comp1.hasValue() && comp2.hasValue() && comp3.hasValue()){
                  return true;
                } else {
                  return false;
                }
            };

            //Add error to errorlist
            this._error.addError(["ERROR", "Er is geen input meegegeven.", solvefunc, solveparam]);
            Logger.error("SubstrBlock error:", this._input1, "or", this._input2, "or", this._input3, "is empty");
          } 

          flowcontroller.setAction(null);

        })})});
    }
  
    private _label: LabelComponent;
    private _label2: LabelComponent;
    private _label3: LabelComponent;
    private _input1: InputComponent<number>;
    private _input2: InputComponent<number>;
    private _input3: InputComponent<string>;
    private _return: ReturnComponent<string>;
    private _error: ErrorComponent;
  }