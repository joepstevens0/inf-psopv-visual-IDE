import Block from "../../block/block";
import {
  LabelComponent,
  ReturnComponent,
  ErrorComponent
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';
import ProjectVars from '../../project/projectvars';

import colors from "@/assets/standardcolors.json"
const _color = (colors as any).valueblocks;

export class VarBlock extends Block {
    public constructor() {
      super("Var", _color);

      //Base
      this._label = new LabelComponent(this);
      this._label.setText("error");
      this.addComponent(this._label);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
  
      this._return = new ReturnComponent<any>(this, "any");
      this.addComponent(this._return);
    }
    public execute(flowcontroller : FlowController): void {
      this._return.setValue(this._pv?.valueOf(this._varname, this));
      flowcontroller.setAction(null);
    }
  
    private _label: LabelComponent;
    private _return: ReturnComponent<any>;
    private _error: ErrorComponent;

    public setProjectVars(projectvars: ProjectVars){
      this._pv = projectvars;
    }
    public setVarName(varname: string){
      this._varname = varname;
      this._label.setText(varname);
    }
    public getVarName(): string{
      return this._varname;
    }

    public save(): any{
      return {supersave: super.save(), varname: this._varname};
    }
  
    public load(data: any): Block{
      super.load(data.supersave);
      this.setVarName(data.varname);
      return this;
    }

    private _pv: ProjectVars | null = null;
    private _varname = "";
}