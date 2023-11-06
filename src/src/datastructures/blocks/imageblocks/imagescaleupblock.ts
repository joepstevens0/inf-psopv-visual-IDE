import Block from "../../block/block";
import {
  AttachComponent,
  InputComponent,
  LabelComponent,
  ConnectComponent,
  BreakComponent,
  ChoiceComponent,
  ErrorComponent
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';

import colors from "@/assets/standardcolors.json"
import { GhostBlock } from '../basicblocks/basicblocks';
import ProjectImgs from "../../project/projectimgs";
const _color = (colors as any).imageblocks;

export class ImageScaleUpBlock extends Block {
    public constructor() {
      super("ImageScaleUpBlock", _color);
  
      // Top
      this.addComponent(new ConnectComponent(this));
      //Bottom
      this._attach = new AttachComponent(this.getColor(), this);
      this.addComponent(this._attach);
      //Base
      this._label = new LabelComponent(this);
      this._label.setText("Vergoot");
      this.addComponent(this._label);
  
      this._choice = new ChoiceComponent(this.getColor(), this);
      this.addComponent(this._choice);
  
      this.addComponent(new BreakComponent(this));
  
      this._label2 = new LabelComponent(this);
      this._label2.setText("met");
      this.addComponent(this._label2);
  
      this._stappeninput = new InputComponent<number>(this, "number");
      this._stappeninput.setDefault(new GhostBlock());
      this.addComponent(this._stappeninput);

      this._error = new ErrorComponent(this);
      this.addComponent(this._error);
  
    }
    public execute(flowcontroller: FlowController): void {
      flowcontroller.setAction(this._stappeninput.getBlock(), () => {
        this.notifyObservers("move:" + this._choice.getValue() + ":scale:" + (this._stappeninput.getValue() as number));
  
        flowcontroller.setAction(this._attach.getNext());
      });
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
  
    private _pi: ProjectImgs | null = null;
  
    private _stappeninput: InputComponent<number>;
    private _attach: AttachComponent;
    private _label: LabelComponent;
    private _label2: LabelComponent;
    private _choice: ChoiceComponent;
    private _error: ErrorComponent;
  }
  