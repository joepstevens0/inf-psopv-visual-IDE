import Block from "../../block/block";
import {
  AttachComponent,
  EnclosureComponent,
  InputComponent,
  LabelComponent,
  ConnectComponent,
  ErrorComponent
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';
import Logger from "@/util/logger"

import colors from "@/assets/standardcolors.json"
const _color = (colors as any).testblocks;

export class IfBlock extends Block {
    public constructor() {
      super("If", _color);
      //Top
      this._connect = new ConnectComponent(this);
      this.addComponent(this._connect);
      //Bottom
      this._enclose = new EnclosureComponent(this.getColor(), this);
      this.addComponent(this._enclose);
      this._attach = new AttachComponent(this.getColor(), this);
      this.addComponent(this._attach);
      //Base
      this._label = new LabelComponent(this);
      this._label.setText("Als");
      this.addComponent(this._label);
      this._input = new InputComponent<boolean>(this, "boolean");
      this.addComponent(this._input);
      this._label2 = new LabelComponent(this);
      this._label2.setText("dan");
      this.addComponent(this._label2);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
    }
    public execute(flowcontroller : FlowController): void {
      flowcontroller.setAction(this._input.getBlock(), () => {
        //If there is no input
        if (this._input.getBlock() == null){

          // error that gets caught: No input
          // How to solve: check if the input

          // Create function that checks if said error is solved:
          const solveparam = [this._input];
          const solvefunc = function(param: InputComponent<boolean>[]) : boolean {
              const inputcomp = param[0];

              if (inputcomp.getBlock()) {
                return true;
              } else {
                  return false;
              }
          };

          this._error.addError(["ERROR", "Er is geen input meegegeven.", solvefunc, solveparam]);
          Logger.error("Error in if-block: no condition given");
        }
        
        if (this._input.getValue() == true)
        flowcontroller.setAction(this._enclose.getFirstBlock(), () => {
          flowcontroller.setAction(this._attach.getNext());
          });
        else
          flowcontroller.setAction(this._attach.getNext());
      });
    }
  
    private _input: InputComponent<boolean>;
    private _enclose: EnclosureComponent;
    private _attach: AttachComponent;
    private _label: LabelComponent;
    private _label2: LabelComponent;
    private _connect: ConnectComponent;
    private _error: ErrorComponent;
}