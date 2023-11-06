import Block from "../block";
import BlockClassSaveLoad from '../BlockClassSaveLoad';
import Logger from "@/util/logger";
import BlockComponent, {BASEJSON} from './blockcomponent';
import { ConnectComponent } from './connectcomponent';

export class AttachComponent extends BlockComponent {
    public setNext(nextblock: Block | null) {
      if(this._next != null){
        this._next.removeObserver(this.getParent());
        (this._next.getComponent("Connect") as ConnectComponent).setAttached(false);
      }
      this._next = nextblock;
      this._next?.addObserver(this.getParent());
      (this._next?.getComponent("Connect") as ConnectComponent).setAttached(true);
    }
    public getNext(): Block | null {
      return this._next;
    }
    public constructor(color: string, parentBlock : Block) {
      super("Attach", color, parentBlock);
    }
    save(): any {
      const d : BASEJSON = super.save();
      if(this._next)
        d.extradata = BlockClassSaveLoad.saveBlock(this._next);
      return d;
    }
    load(data: any, parentBlock: Block): AttachComponent {
      super.load(data, parentBlock);
      const d : BASEJSON = data;
      if(d.extradata != "")
      this.setNext(BlockClassSaveLoad.loadBlock(d.extradata));
      return this;
    }
  
    private _next: Block | null = null;
}