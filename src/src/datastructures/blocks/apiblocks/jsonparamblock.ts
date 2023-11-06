import Block from "../../block/block";
import {
  InputComponent,
  LabelComponent,
  BreakComponent,
  APIConnectComponent,
  APIAttachComponent,
  ErrorComponent
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';
import Vue from "vue";

import colors from "@/assets/standardcolors.json"
import { GhostBlock } from '../basicblocks/basicblocks';
const _color = (colors as any).apiblocks;

export class JSONParamBlock extends Block {
  public constructor() {
    super("JSONParam", _color);
    //Top
    this._connect = new APIConnectComponent(this);
    this.addComponent(this._connect);

    //Bottom
    this._attach = new APIAttachComponent(this.getColor(), this);
    this.addComponent(this._attach);

    //Base
    this._fieldlabel = new LabelComponent(this);
    this._fieldlabel.setText("Veld");
    this.addComponent(this._fieldlabel);

    this._fieldinput = new InputComponent<string>(this, "string");
    this._fieldinput.setDefault(new GhostBlock());
    this.addComponent(this._fieldinput);

    this.addComponent(new BreakComponent(this));

    this._valuelabel = new LabelComponent(this);
    this._valuelabel.setText("Waarde");
    this.addComponent(this._valuelabel);

    this._valueinput = new InputComponent<any>(this, "any");
    this._valueinput.setDefault(new GhostBlock());
    this.addComponent(this._valueinput);

    this._error = new ErrorComponent(this);
    this.addComponent(this._error);
  }

  public getString(){
    return this._string;
  }

  public getNextParam(){
    return this._attach.getNext()
  }

  public execute(flowcontroller : FlowController): void {
    flowcontroller.setAction(this._fieldinput.getBlock(), () => { flowcontroller.setAction(this._valueinput.getBlock(), () => {

     this._string = '"' + this._fieldinput.getValue() + '":"'+ (this._valueinput.getValue() as string) + '"';  

      flowcontroller.setAction(null);
    })});
  }

  private _connect: APIConnectComponent;
  private _attach: APIAttachComponent;
  private _fieldlabel: LabelComponent;
  private _valuelabel: LabelComponent;
  private _fieldinput: InputComponent<string>;
  private _valueinput: InputComponent<any>;
  private _string: string;
  private _error: ErrorComponent;
}