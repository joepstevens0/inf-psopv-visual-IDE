import Block from "../block";
import BlockClassSaveLoad from '../BlockClassSaveLoad';
import Logger from "@/util/logger";
import BlockComponent, {BASEJSON} from './blockcomponent';

export class LabelComponent extends BlockComponent {
    public setText(text: string) {
      this._text = text;
    }
    public getText(): string {
      return this._text;
    }
    public constructor(parentBlock : Block) {
      super("Label", "", parentBlock);
    }
    save(): any {
      const d : BASEJSON = super.save();
      d.extradata = this._text;
      return d;
    }
    load(data: any, parentBlock: Block): LabelComponent {
      super.load(data, parentBlock);
      const d : BASEJSON = data;
      this.setText(d.extradata);
      return this;
    }
  
    private _text = "";
}