import Block from "../block";
import BlockClassSaveLoad from '../BlockClassSaveLoad';
import Logger from "@/util/logger";
import BlockComponent, {BASEJSON} from './blockcomponent';
import { APIConnectComponent } from './apiconnectcomponent';


export class APIAttachComponent extends BlockComponent {
    public setNext(nextblock: Block | null) {
      if(this._next != null){
        (this._next.getComponent("APIConnect") as APIConnectComponent).setAttached(false);
        this._next.removeObserver(this.getParent())
      }
      this._next = nextblock;
      this._next?.addObserver(this.getParent());
      (this._next?.getComponent("APIConnect") as APIConnectComponent).setAttached(true);
    }
    public getNext(): Block | null {
      return this._next;
    }
    public constructor(color: string, parentBlock : Block) {
      super("APIAttach", color, parentBlock);
    }
    save(): any {
      const d : BASEJSON = super.save();
      if(this._next)
        d.extradata = BlockClassSaveLoad.saveBlock(this._next);
      return d;
    }
    load(data: any, parentBlock: Block): APIAttachComponent {
      super.load(data, parentBlock);
      const d : BASEJSON = data;
      if(d.extradata != "")
        this.setNext(BlockClassSaveLoad.loadBlock(d.extradata));
      return this;
    }
  
    private _next: Block | null = null;
  }