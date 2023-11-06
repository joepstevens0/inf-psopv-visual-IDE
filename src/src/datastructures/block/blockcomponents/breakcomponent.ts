import Block from "../block";
import BlockClassSaveLoad from '../BlockClassSaveLoad';
import Logger from "@/util/logger";
import BlockComponent from './blockcomponent';


export class BreakComponent extends BlockComponent { 
    public constructor(parentBlock : Block) {
      super("Break", "white", parentBlock);
    }
    save(): any {
      return super.save();
    }
    load(data: any, parentBlock: Block): BreakComponent {
      return super.load(data, parentBlock);
    }
  }