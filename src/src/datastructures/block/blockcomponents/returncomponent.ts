import Block from "../block";
import BlockClassSaveLoad from '../BlockClassSaveLoad';
import Logger from "@/util/logger";
import BlockComponent, {BASEJSON} from './blockcomponent';

export class ReturnComponent<T> extends BlockComponent {
    public setValue(val: T) {
      this._value = val;
    }
    public getValue(): T | undefined {
      return this._value;
    }
    public getCompType() : string {
      return this._type;
    }
    public constructor(parentBlock : Block, type: string) {
      const n = "Return" + type;
      super(n, "#008000", parentBlock);
      this._type = type;
    }
    save(): any {
      const d : BASEJSON = super.save();
      d.extradata = this._value;
      return d;
    }
    load(data: any, parentBlock: Block): ReturnComponent<T> {
      super.load(data, parentBlock);
      const d : BASEJSON = data;
      this.setValue(d.extradata);
      return this;
    }
  
    private _value: T | undefined;
    private _type: string;
  }