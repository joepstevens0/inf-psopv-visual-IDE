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
import { GhostBlock } from '../basicblocks/basicblocks';
import ProjectImgs from "../../project/projectimgs";
const _color = (colors as any).imageblocks;

export class ImageClickBlock extends Block {
    public constructor() {
      super("ImageClickBlock", _color);
  
      // Top
      this._start = new StartComponent(_color, this);
      this._start.setValidator(this.getValidator());
      this.addComponent(this._start);
      //Bottom
      this._attach = new AttachComponent(this.getColor(), this);
      this.addComponent(this._attach);
      //Base
      this._label = new LabelComponent(this);
      this._label.setText("Start op klik van");
      this.addComponent(this._label);
  
      this._choice = new ChoiceComponent(this.getColor(), this);
      this.addComponent(this._choice);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
    }
    public execute(flowcontroller: FlowController): void {
        flowcontroller.setAction(this._attach.getNext());
    }
  
    public imageClick(name: string, flowcontroller: FlowController){
        if (name == this._choice.getValue()){
            this.execute(flowcontroller);
        }
    }
    update(message: any): void {
      super.notifyObservers(message);
      if (typeof message != "string") return;
      const s = (message as string).split(":");
      if (s[0] == "imgdelete" || s[0] == "imgadd")
        this.setOptions();
    }
  
    public setProjectImgs(projectimgs: ProjectImgs) {
      this._pi = projectimgs;
      this._pi.addObserver(this);
      this.setOptions();
    }
  
    /**
     * update the image options from ProjectImgs
     */
    setOptions() {
      if (this._pi == null) return;
      const options: string[] = [];
      for (let i = 0; i < this._pi.nImgs(); ++i) {
        options.push(this._pi.getImgName(i));
      }
      const index = this._choice.selectedIndex();
      this._choice.setOptions(options);
      if (index < options.length)this._choice.setValue(index);
    }

    private getValidator(): (info:string) => boolean{
        return (info: string)=>{
            if (info.startsWith("imageclick:")){
                return info.substring(info.indexOf(":") + 1) == this._choice.getValue();
            }
            return false;
        };
    }
  
  
    private _pi: ProjectImgs | null = null;
  
    private _start: StartComponent;
    private _attach: AttachComponent;
    private _label: LabelComponent;
    private _choice: ChoiceComponent;
    private _error: ErrorComponent;
  }