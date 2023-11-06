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

import colors from "@/assets/standardcolors.json"
const _color = (colors as any).testblocks;

export class IfElseBlock extends Block {
    public constructor() {
      super("IfElse", _color);
      //Top
      this._connect = new ConnectComponent(this);
      this.addComponent(this._connect);
      //Bottom
      this._encloseif = new EnclosureComponent(this.getColor(), this);
      this.addComponent(this._encloseif);
      this._encloseelse = new EnclosureComponent(this.getColor(), this);
      this.addComponent(this._encloseelse);
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

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
    }
    public execute(flowcontroller : FlowController): void {
      flowcontroller.setAction(this._input.getBlock(), () => {
        if (this._input.getValue() == true) {
          flowcontroller.setAction(this._encloseif.getFirstBlock(), () => {
            flowcontroller.setAction(this._attach.getNext());
          });
        } else {
          flowcontroller.setAction(this._encloseelse.getFirstBlock(), () => {
            flowcontroller.setAction(this._attach.getNext());
          });
        }
      });
    }
  
    private _input: InputComponent<boolean>;
    private _encloseif: EnclosureComponent;
    private _encloseelse: EnclosureComponent;
    private _attach: AttachComponent;
    private _label: LabelComponent;
    private _label2: LabelComponent;
    private _connect: ConnectComponent;
    private _error: ErrorComponent;
  }
