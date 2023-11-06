import Block from "../block";
import BlockClassSaveLoad from '../BlockClassSaveLoad';
import Logger from "@/util/logger";
import BlockComponent, {BASEJSON} from './blockcomponent';
import { ReturnComponent } from './returncomponent';

export class InputComponent<T> extends BlockComponent {
    public constructor(parentBlock : Block, type: string) {
      const n = "Input" + type;
      super(n, "white", parentBlock);
      this._type = type;
      this._block = null;
      this._defaultblock = null;
    }
  
    public getCompType() : string {
      return this._type;
    }
    
    public setBlock(block: Block | null) {
  
      if (block == null){
        this._block = this._defaultblock;
      }
      else {
        // Check types of Components
        const wantedtype = "Return" + this._type;
        if (this._type == "any" || block.getComponent("Returnany") != null || block.getComponent(wantedtype) != null){
          //Connect
          if(this._block != null)
            this._block.removeObserver(this.getParent())
          this._block = block;
          this._block?.addObserver(this.getParent());
  
          //Else throw  
        } else {
          //Error needs to be thrown, so block that is holded doesn't disappear
          const msg = "Type '" + this.typeToDutch(this._type) + "' en '" + this.typeToDutch(block.getComponent("Return").getCompType()) + "' zijn niet hetzelfde!";
          throw new TypeError(msg);
        }
      }
    }
  
    private typeToDutch(type: string) {
      if (type == "any"){
        return "alles";
      }
      else if (type == "number"){
        return "getal";
      }
      else if (type == "string"){
        return "tekst";
      }
      else if (type == "boolean"){
        return "waar/onwaar";
      }
    }
  
    /**
     * cast the value to the type T of the component
     * @param val casting value
     * @returns val cast to type T or undefined
     */
    public cast(val: any): any | null{
      if (typeof val == this._type)
        return val;
      if(this._type == "number"){
        if (val != "" && !isNaN(Number(val)))
          return Number(val);
      }else if (this._type == "boolean"){
        if(val == "true") return true;
        if(val == "waar") return true;
        if(val == "1") return true;
        if(val == 1) return true;
        if(val == "false") return false;
        if(val == "niet waar") return false;
        if(val == "0") return false;
        if(val == 0) return false;
      }else if(this._type == "string" && val != undefined)
        return val as string;
      else if(this._type == "any")
        return val as T;
      return null;
    }
  
    public getBlock(): Block | null{
      return this._block;
    }

    // Returns true if inputcomponent contains a value
    public hasValue() : boolean {
      if (this._block?.hasComponent("Return")) {
        const val =  (this._block.getComponent("Return") as ReturnComponent<T
        >).getValue();
  
        // Try to cast the value to the wanted type of value
        const castval = this.cast(val);
  
        // If the cast fails, create return false
        if (castval === null){
          return false;
        } else {
          return true;
        }
      }
      return false;
    }
  
    // Returns the value of the block that is inserted in inputcomponent.
    // Returns null and adds error if not possible
    public getValue(): T | undefined {
      if (this._block?.hasComponent("Return")) {
        const val =  (this._block.getComponent("Return") as ReturnComponent<T
        >).getValue();
  
        // Try to cast the value to the wanted type of value
        const castval = this.cast(val);
  
        // If the cast fails, create an errormessage
        if (castval === null){
          let msg;
          if (val == undefined || (val as string) == ""){
            msg = "Er is geen correcte input gegeven!";
            
          } else{
            msg = "Dit blok aanvaard alleen type '" + this.typeToDutch(this._type) + "' en niet '" + val + "'";
          }
  
          // error: no right input is given 
          // How to solve: check if right input is given.
  
          // Create function that checks if said error is solved:
          const solveparam = [this];
          const solvefunc = function(param: InputComponent<T>[]) : boolean {
              const inputcomp = param[0];
  
              if (inputcomp.getBlock()?.hasComponent("Return")) {
                const val = (inputcomp.getBlock().getComponent("Return") as ReturnComponent<T>).getValue();
      
                // Try to cast the value to the wanted type of value
                const castval = inputcomp.cast(val);
          
                // If the cast fails, create an errormessage
                if (castval === null){
                    return false;
                } else {
                    return true;
                }
              } else {
                  return false;
              }
          };
  
          // Give error to errorcomponent
          (this.getParent().getComponent("Error") as ErrorComponent).addError(["ERROR", msg, solvefunc, solveparam]);
          Logger.error("Error while executing:", msg);
   
        }
        return castval;
      }
      return undefined;
    }
    public setDefault(block: Block){
      this._defaultblock = block;
      if(this._block == null){
        this._block = this._defaultblock;
      }
    }
    save(): any {
      const d : BASEJSON = super.save();
      d.extradata =
        {
          block: this._block? BlockClassSaveLoad.saveBlock(this._block) : "",
          default: this._defaultblock? BlockClassSaveLoad.saveBlock(this._defaultblock) : ""
        };
      return d;
    }
    load(data: any, parentBlock: Block): InputComponent<T> {
      super.load(data, parentBlock);
      const d : BASEJSON = data;
      const extra:{block: string, default: string} = d.extradata;
      if(extra.block != ""){
        const block = BlockClassSaveLoad.loadBlock(extra.block)
        if(this._block != null)
          this._block.removeObserver(this.getParent())
        this._block = block;
        this._block?.addObserver(this.getParent());
      }
      if(extra.default != "")
      this.setDefault(BlockClassSaveLoad.loadBlock(extra.default));
      return this;
    }
  
    private _block: Block | null;
    private _defaultblock: Block | null;
    private _type: string;
  }