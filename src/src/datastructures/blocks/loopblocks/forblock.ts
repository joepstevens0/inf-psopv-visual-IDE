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
import { GhostBlock } from '../basicblocks/basicblocks';
const _color = (colors as any).loopblocks;

export class ForBlock extends Block {
    public constructor() {
      super("For", _color);
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
      this._label.setText("Herhaal");
      this.addComponent(this._label);
      this._input = new InputComponent<number>(this, "number");
      this._input.setDefault(new GhostBlock());
      this.addComponent(this._input);
      this._label2 = new LabelComponent(this);
      this._label2.setText("keer");
      this.addComponent(this._label2);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
    }
    public execute(flowcontroller : FlowController): void {
      flowcontroller.setAction(this._input.getBlock(), () => {
        if (this._input.getValue() != undefined) {
          let i = this._input.getValue() as number;
          const f = () => {
            if (i > 0) {
              flowcontroller.setAction(this._enclose.getFirstBlock(), f);
            } else {
              flowcontroller.setAction(this._attach.getNext());
            }
            --i;
          };
  
          f.apply([]);
  
        } else {
          flowcontroller.setAction(this._attach.getNext());
        }
      });
    }
  
    private _enclose: EnclosureComponent;
    private _attach: AttachComponent;
    private _label: LabelComponent;
    private _label2: LabelComponent;
    private _connect: ConnectComponent;
    private _input: InputComponent<number>;
    private _error: ErrorComponent;
  }