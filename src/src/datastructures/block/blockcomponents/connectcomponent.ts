import Block from "../block";
import BlockClassSaveLoad from '../BlockClassSaveLoad';
import Logger from "@/util/logger";
import BlockComponent, {BASEJSON} from './blockcomponent';

export class ConnectComponent extends BlockComponent {
    public constructor(parentBlock : Block) {
      super("Connect", "white", parentBlock);
    }
  
    save(): any {
      const d : BASEJSON = super.save();
      d.extradata = this.isAttached;
      return d;
    }
    load(data: any, parentBlock: Block): ConnectComponent {
      super.load(data, parentBlock);
      const d : BASEJSON = data;
      this.isAttached = d.extradata;
      return this;
    }
  
    public attached(): boolean{
      return this.isAttached;
    }
    public setAttached(isAttached: boolean){
      this.isAttached = isAttached;
    }
  
    private isAttached = false;
}