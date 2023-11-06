import Block from "../../block/block";
import {
  AttachComponent,
  LabelComponent,
  ChoiceComponent,
  ErrorComponent,
  StartComponent
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';

import colors from "@/assets/standardcolors.json"
const _color = (colors as any).startblocks;

export class KeyStartBlock extends Block {
    public constructor() {
      super("KeyStartBlock", _color);
  
      // Top
      this._start = new StartComponent(_color, this);
      this._start.setValidator(this.getValidator());
      this.addComponent(this._start);
      //Bottom
      this._attach = new AttachComponent(this.getColor(), this);
      this.addComponent(this._attach);
      //Base
      this._label = new LabelComponent(this);
      this._label.setText("Start op drukken van");
      this.addComponent(this._label);
  
      this._choice = new ChoiceComponent(this.getColor(), this);
      this._choice.setOptions(this._options);
      this.addComponent(this._choice);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
    }
    public execute(flowcontroller: FlowController): void {
        flowcontroller.setAction(this._attach.getNext());
    }
  
    private getValidator(): (info:string) => boolean{
        return (info: string)=>{
            const choice = this._choice.getValue();
            if (info == choice) return true;
            if (choice == "spatie" && info == " ") return true;
            if (choice == "pijltje omhoog" && info == "ArrowUp") return true;
            if (choice == "pijltje omlaag" && info == "ArrowDown") return true;
            if (choice == "pijltje links" && info == "ArrowLeft") return true;
            if (choice == "pijltje rechts" && info == "ArrowRight") return true;

            return false;
        };
    }
  
    private _options: string[] = ["spatie", "pijltje omhoog", "pijltje omlaag", "pijltje links", "pijltje rechts",
        'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
        '0','1','2','3','4','5','6','7','8','9'];
  
    private _start: StartComponent;
    private _attach: AttachComponent;
    private _label: LabelComponent;
    private _choice: ChoiceComponent;
    private _error: ErrorComponent;
  }