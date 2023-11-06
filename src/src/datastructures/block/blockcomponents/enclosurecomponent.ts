import Block from "../block";
import BlockClassSaveLoad from '../BlockClassSaveLoad';
import Logger from "@/util/logger";
import BlockComponent, {BASEJSON} from './blockcomponent';
import { ConnectComponent } from './connectcomponent';


export class EnclosureComponent extends BlockComponent {
    public setFirstBlock(block: Block | null): void {
      if(this._firstblock != null){
        this._firstblock.removeObserver(this.getParent());
        (this._firstblock.getComponent("Connect") as ConnectComponent).setAttached(false);
      }
      this._firstblock = block;
  
      this._firstblock?.addObserver(this.getParent());
      (this._firstblock?.getComponent("Connect") as ConnectComponent).setAttached(true);
    }
    public getFirstBlock(): Block | null {
      return this._firstblock;
    }
    public constructor(color: string, parentBlock : Block) {
      super("Enclosure", color, parentBlock);
    }
    save(): any {
      const d : BASEJSON = super.save();
      if(this._firstblock)
        d.extradata = BlockClassSaveLoad.saveBlock(this._firstblock);
      return d;
    }
    load(data: any, parentBlock: Block): EnclosureComponent {
      super.load(data, parentBlock);
      const d : BASEJSON = data;
      if(d.extradata != "")
      this.setFirstBlock(BlockClassSaveLoad.loadBlock(d.extradata));
      return this;
    }
  
    private _firstblock: Block | null = null;
}