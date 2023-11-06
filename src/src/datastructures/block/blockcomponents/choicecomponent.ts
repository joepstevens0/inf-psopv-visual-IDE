import Block from "../block";
import BlockClassSaveLoad from '../BlockClassSaveLoad';
import Logger from "@/util/logger";
import BlockComponent, {BASEJSON} from './blockcomponent';

export class ChoiceComponent extends BlockComponent {
    public setValue(index: number) {
      this._index = index;
  
      Logger.debug("ChoiceComponent index changed to:", this._index, "| new value:", this._options[this._index]);
    }
    public selectedIndex():number{
      return this._index;
    }
    public setOptions(options: string[]){
      this._options = options;
      this._index = 0;
  
      Logger.debug("ChoiceComponent options changed to:", options, "| index reset to 0");
      
    }
    public addOption(option: string){
      this._options.push(option);
    }
    public getValue(): string{
      if (this._options.length <= this._index){
        return "";
      }
      return this._options[this._index];
    }
    public getOptions(): string[]{
      return this._options;
    }
    public constructor(color: string, parentBlock : Block) {
      super("Choice", color, parentBlock);
    }
    save(): any {
      const d : BASEJSON = super.save();
      d.extradata = {index: this._index, options: this._options};
      return d;
    }
    load(data: any, parentBlock: Block): ChoiceComponent {
      super.load(data, parentBlock);
      const d : BASEJSON = data;
      this.setOptions(d.extradata.options);
      this.setValue(d.extradata.index);
      return this;
    }
  
    private _index = 0;
    private _options: string[] = [];
  }