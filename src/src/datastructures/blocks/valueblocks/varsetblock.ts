import Block from "../../block/block";
import {
  InputComponent,
  AttachComponent,
  LabelComponent,
  ConnectComponent,
  BreakComponent,
  ErrorComponent
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';
import ProjectVars from '../../project/projectvars';

import colors from "@/assets/standardcolors.json"
import { GhostBlock } from '../basicblocks/basicblocks';
const _color = (colors as any).valueblocks;

export class VarSetBlock extends Block {
    public constructor() {
      super("VarSet", _color);
      //Top
      this._connect = new ConnectComponent(this);
      this.addComponent(this._connect);
      //Bottom
      this._attach = new AttachComponent(this.getColor(), this);
      this.addComponent(this._attach);
      //Base
      this._label = new LabelComponent(this);
      this._label.setText("Zet variabele");
      this.addComponent(this._label);

      this.addComponent(new BreakComponent(this));

      this._input = new InputComponent<string>(this, "string");
      this.addComponent(this._input);

      this._label2 = new LabelComponent(this);
      this._label2.setText("=");
      this.addComponent(this._label2);

      this._input2 = new InputComponent<any>(this, "any");
      this._input2.setDefault(new GhostBlock());
      this.addComponent(this._input2);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
    }
    public execute(flowcontroller : FlowController): void {
      flowcontroller.setAction(this._input.getBlock(), ()=>{
        flowcontroller.setAction(this._input2.getBlock(), ()=>{
          if (this._input.getBlock()?.getName() == "Var")
            this._pv?.setVar((this._input.getBlock() as VarBlock).getVarName(), this._input2.getValue() as string + "", null);
          flowcontroller.setAction(this._attach.getNext());
        });
      });
    }

    public setProjectVars(projectvars: ProjectVars){
      this._pv = projectvars;
    }
  
    private _attach: AttachComponent;
    private _label: LabelComponent;
    private _label2: LabelComponent;
    private _input: InputComponent<string>;
    private _input2: InputComponent<any>;
    private _connect: ConnectComponent;
    private _error: ErrorComponent;

    private _pv: ProjectVars | null = null;
  }