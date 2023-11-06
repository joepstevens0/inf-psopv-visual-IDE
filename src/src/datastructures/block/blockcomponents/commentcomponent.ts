import Block from "../block";
import BlockClassSaveLoad from '../BlockClassSaveLoad';
import Logger from "@/util/logger";
import BlockComponent, {BASEJSON} from './blockcomponent';
import { ReturnComponent } from './returncomponent';

export class CommentComponent extends BlockComponent {

    public constructor(parentBlock : Block) {
      super("Comment", "white", parentBlock);
      this.setText("");
    }

    public getText(): string {
      return this._text;
    }
    public setText(text: string): void {
      this._text = text;
    }

    save(): any {
      const d : BASEJSON = super.save();
      d.extradata = this._text;
      return d;
    }
    load(data: any, parentBlock: Block): CommentComponent {
      super.load(data, parentBlock);
      const d : BASEJSON = data;
      this.setText(d.extradata);
      return this;
    }
  
    private _text: string;
  }