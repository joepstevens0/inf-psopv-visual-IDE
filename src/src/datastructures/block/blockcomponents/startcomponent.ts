import Block from "../block";
import BlockClassSaveLoad from '../BlockClassSaveLoad';
import Logger from "@/util/logger";
import BlockComponent from './blockcomponent';


export class StartComponent extends BlockComponent {
    public constructor(color: string, parentBlock : Block) {
      super("Start", color, parentBlock);
    }
  
    public save(): any {
      return super.save();
    }
    public load(data: any, parentBlock: Block): StartComponent {
      super.load(data, parentBlock);
      return this;
    }
    public match(info: string): boolean{
      return this._validator(info);
    }
  
    public setValidator(f:  (info: string) => boolean){
      this._validator = f;
    }
  
    private _validator: (info: string) => boolean = () => { return false;};
}