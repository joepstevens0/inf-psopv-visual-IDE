import Block from "../../block/block";
import {
  ConnectComponent,
  AttachComponent,
  LabelComponent,
  CommentComponent,
  BreakComponent,
  ErrorComponent
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';

import colors from "@/assets/standardcolors.json"
import { GhostBlock } from '../basicblocks/basicblocks';
const _color = (colors as any).stringblocks;

export class CommentBlock extends Block {
    public constructor() {
      super("Comment", _color);
      //Top
      this._connect = new ConnectComponent(this);
      this.addComponent(this._connect);
      //Bottom
      this._attach = new AttachComponent(this.getColor(), this);
      this.addComponent(this._attach);
      //Base
      this._label = new LabelComponent(this);
      this._label.setText("Commentaar: ");
      this.addComponent(this._label);
  
      this.addComponent(new BreakComponent(this));
  
      this._comment = new CommentComponent(this);
      this.addComponent(this._comment);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
    }
    public execute(flowcontroller : FlowController): void {
      //Does nothing
      flowcontroller.setAction(this._attach.getNext());
    }
  
    private _comment: CommentComponent;
    private _attach: AttachComponent;
    private _label: LabelComponent;
    private _connect: ConnectComponent;
    private _error: ErrorComponent;
  }