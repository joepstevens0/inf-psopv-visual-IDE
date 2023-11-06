import { Observable, Observer } from "../../util/observer";
import  BlockComponent, { InputComponent, EnclosureComponent, AttachComponent }  from "./blockcomponent";
import { FlowController } from '../controllers/flowcontroller';
import { VarBlock, FunctionCallBlock } from "../blocks/blockclasses";

let _id = 0;

type BLOCKJSON = {name: string, blockid: number, color: string, components: string[]}

export default class Block extends Observable implements Observer{
  public constructor(name: string, color: string) {
    super();
    this._name = name;
    this._blockid = _id++;
    this._color = color;
  }
  update(message: any): void {
    this.notifyObservers(message);
  }

  public createCopy() : Block{
    const clone = new (this.constructor as any);
    clone._blockid = _id++;
    return clone;
  }

  public getName(): string {
    return this._name;
  }

  public getId(): number {
    return this._blockid;
  }

  public getColor(): string {
    return this._color;
  }

  public execute(flowcontroller : FlowController): void {
    // overide
  }

  protected addComponent(component: BlockComponent) {
    this._components.push(component);
  }
  protected removeComponent(index: number){
    this._components.splice(index,1);
  }
  public hasComponent(name: string): boolean {
    for (let i = 0; i < this._components.length; ++i) {
      if (this._components[i].getName().startsWith(name) == true) return true;
    }

    return false;
  }
  public getComponent(name: string): BlockComponent | null {
    for (let i = 0; i < this._components.length; ++i) {
      if (this._components[i].getName().startsWith(name) == true)
        return this._components[i];
    }
    return null;
  }
  public getNComponent(n: number): BlockComponent{
    return this._components[n];
  }
  public nComponents() : number{
    return this._components.length;
  }

  /**
   * Returns array of [name, block] duos for every var or func contained by the components
   */
  public getCompsContainVarOrFunc(blockname: string) : [string, Block][] {
    let array = [] as [string, Block][];

    // If this block is what we search for
    if (this.getName() == blockname) {
        // Add to array depending on type
        if (blockname == "Var"){
          array.push([(this as VarBlock).getVarName(), this]);
        } 
        else if (blockname == "FunctionCall") {
          array.push([(this as FunctionCallBlock).getFunctionName(), this]);
        }
    }

    // If this has InputComponent
    if (this.hasComponent("Input")) {

      // Get first block in component
      const inputblock = (this.getComponent("Input") as InputComponent<T>).getBlock();

      // If block != null
      if (inputblock) {
        // Recursive function on that block 
        array = array.concat( inputblock.getCompsContainVarOrFunc(blockname) );
      }
    }

    // If this has EncloseComponent
    if (this.hasComponent("Enclosure")) {

      // Get first block in component
      const encloseblock = (this.getComponent("Enclosure") as EnclosureComponent).getFirstBlock();

      // If block != null
      if (encloseblock) {
        // Recursive function on that block 
        array = array.concat( encloseblock.getCompsContainVarOrFunc(blockname) );
      }
    }

    // If this has component
    if (this.hasComponent("Attach") && this.getName() != "FunctionEnclose") {

      // Get first block in component
      const attachblock = (this.getComponent("Attach") as AttachComponent).getNext();

      // If block != null
      if (attachblock) {
        // Recursive function on that block 
        array = array.concat( attachblock.getCompsContainVarOrFunc(blockname) );
      }
    }

    return array;
  }

  /**
   * Returns array of blocks with errors
   */
  public getCompsContainErrors() : Block[] {
    let array = [] as Block[];

    // If this block is what we search for
    if (this.hasComponent("Error")) {
        array.push(this);
    }

    // If this has InputComponent
    if (this.hasComponent("Input")) {

      // Get first block in component
      const inputblock = (this.getComponent("Input") as InputComponent<T>).getBlock();

      // If block != null
      if (inputblock) {
        // Recursive function on that block 
        array = array.concat( inputblock.getCompsContainErrors() );
      }
    }

    // If this has EncloseComponent
    if (this.hasComponent("Enclosure")) {

      // Get first block in component
      const encloseblock = (this.getComponent("Enclosure") as EnclosureComponent).getFirstBlock();

      // If block != null
      if (encloseblock) {
        // Recursive function on that block 
        array = array.concat( encloseblock.getCompsContainErrors() );
      }
    }

    // If this has component
    if (this.hasComponent("Attach") && this.getName() != "FunctionEnclose") {

      // Get first block in component
      const attachblock = (this.getComponent("Attach") as AttachComponent).getNext();

      // If block != null
      if (attachblock) {
        // Recursive function on that block 
        array = array.concat( attachblock.getCompsContainErrors() );
      }
    }

    return array;
  }

  public save(): any{
    const d: BLOCKJSON = {name: this._name, blockid: this._blockid, color: this._color,components:[]};
    for(let i = 0; i < this._components.length;++i){
      d.components.push( this._components[i].save());
    }
    return d;
  }

  public load(data: any): Block{
    const d: BLOCKJSON = data;
    this._blockid = d.blockid;
    this._name = d.name;
    this._color = d.color;

    // load components
    for(let i = 0; i < d.components.length;++i){
      this._components[i].load(d.components[i], this);
    }
    return this;
  }

  public setStatus(isActive: boolean){
    this._isActive = isActive;
  }

  public isActive(): boolean{
    return this._isActive;
  }

  private _name: string;
  private _blockid: number;
  private _color: string;
  private _components: BlockComponent[] = [];

  private _isActive = false;
}
