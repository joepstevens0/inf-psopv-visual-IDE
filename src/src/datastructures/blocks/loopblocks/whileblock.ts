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
const _color = (colors as any).loopblocks;

export class WhileBlock extends Block {
    public constructor() {
      super("While", _color);
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
      this._label.setText("Terwijl");
      this.addComponent(this._label);
      this._input = new InputComponent<boolean>(this, "boolean");
      this.addComponent(this._input);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
    }
    public execute(flowcontroller : FlowController): void {
      const f = () => {
          flowcontroller.setAction(this._input.getBlock(), ()=> {
          if(this._input.getValue() == true){
            if (this._enclose.getFirstBlock() == null)
              flowcontroller.setAction(this);
            else
              flowcontroller.setAction(this._enclose.getFirstBlock(), f);
          }
          else{
            flowcontroller.setAction(this._attach.getNext());
          }
        });
      };
      f.apply(this);
    }
  
    private _input: InputComponent<boolean>;
    private _enclose: EnclosureComponent;
    private _attach: AttachComponent;
    private _label: LabelComponent;
    private _connect: ConnectComponent;
    private _error: ErrorComponent;
  }