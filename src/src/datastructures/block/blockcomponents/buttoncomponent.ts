import Block from "../block";
import BlockClassSaveLoad from '../BlockClassSaveLoad';
import Logger from "@/util/logger";
import BlockComponent, {BASEJSON} from './blockcomponent';

export class ButtonComponent extends BlockComponent {
    public constructor(parentBlock : Block) {
      super("Button", parentBlock.getColor(), parentBlock);
      this._function = null;
      this._text = "";
    }
  
    public getFunction() : Function {
      return this._function;
    }
    public setFunction(func: Function) : void {
      this._function = func;
    }
  
    public getText() : string {
      return this._text;
    }
    public setText(text: string) : void {
      this._text = text;
    }
  
    public executeFunction() : void {
      Logger.info("ButtonComponent pressed, executing function.");
      Logger.debug("ButtonComponent pressed, executing function:", this._function);
      this._function();
    }
  
    save(): any {
      const d : BASEJSON = super.save();
      d.extradata = {function: this._function};
      return d;
    }
    load(data: any, parentBlock: Block): ButtonComponent {
      super.load(data, parentBlock);
      const d : BASEJSON = data;
      this.setFunction(d.extradata.function);
      return this;
    }
  
    private _function: Function;
    private _text: string;
  }