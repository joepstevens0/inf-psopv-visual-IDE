import Block from "../block/block";
import { Observable, Observer } from "../../util/observer";
import { FlowController } from '../controllers/flowcontroller';
import ProjectVars from './projectvars';
import ProjectImgs from './projectimgs';
import BlockClassSaveLoad from '../block/BlockClassSaveLoad';
import Logger from '@/util/logger';
import { FunctionCallBlock } from "../blocks/blockclasses";

type ProjectJSON = {projectname:  string, blocks: {x:number,y:number, blockdata:any}[], projectvars: string, projectimgs: any};

export default class Project extends Observable implements Observer {
  public constructor(projectname: string) {
    super();
    this._projectname = projectname;
  }

  update(message: any): void {
    this.notifyObservers(message);

    if (message instanceof Array){
      if (message[0] == "changeCallBlocks"){
        this.updateFuncCallName(message[1], message[2]);
      }
    }
  }

  /**
   * add a block to the project
   * @param newblock adding
   * @param x position on the canvas
   * @param y position on the canvvas
   * @post block added to the project
   */
  public addBlock(newblock: Block, x = 0, y = 0): void {
    Logger.debug("Project |", "adding block:", newblock, "position:", [x,y]);

    newblock.addObserver(this);
    
    this._blocks.push([newblock,x,y]);
  }
  /**
   * remove a block from the project by index
   * @param index of block
   * @post block on index <index> removed from project
   */
  public removeBlock(index: number) {
    Logger.debug("Project |", "removing block:", this._blocks[index]);
    this._blocks[index][0].removeObserver(this);
    this._blocks.splice(index, 1);
  }
  /**
   * get a block from project by index
   * @param index of block
   * @returns block on index <index> 
   * @pre index < nBlocks()
   */
  public getBlock(index: number): Block {
    return this._blocks[index][0];
  }
  /**
   * @returns number of blocks in the project
   */
  public nBlocks(): number {
    return this._blocks.length;
  }
  /**
   * get the index of a block
   * @param block searching for
   * @returns index of block or -1 if not found
   */
  public blockIndex(block: Block): number {
    for (let i = 0; i < this.nBlocks(); ++i) {
      if (this.getBlock(i) == block) return i;
    }
    return -1;
  }

  /**
   * get the x position of a block
   * @param index of block
   * @returns x position of block on index <index>
   * @pre index < nBlocks()
   */
  public getBlockX(index: number): number {
    return this._blocks[index][1];
  }

  /**
   * get the y position of a block
   * @param index of block
   * @returns y position of block on index <index>
   * @pre index < nBlocks()
   */
  public getBlockY(index: number): number {
    return this._blocks[index][2];
  }
 
  /**
   * save to project in a string
   * @returns saved project in string format
   */
  public save(): string {
    // add project members to json
    const data = {
      projectname: this._projectname,
      blocks:[],
      projectvars: this._projectvars.save(),
      projectimgs: this._projectimgs.save()
    } as ProjectJSON;

    // add all blocks
    for(let i = 0; i < this._blocks.length;++i){
      const d = {
        x: this._blocks[i][1],
        y: this._blocks[i][2],
        blockdata: BlockClassSaveLoad.saveBlock(this._blocks[i][0])
      }
      data.blocks.push( d );
    }
    return JSON.stringify(data);
  }

  /**
   * load a project from a string
   * @param data string of a saved project
   * @pre data is created from save()
   * @returns project loaded from string <data>
   */
  public static load(data: string): Project {
    // parse projectdata
    const d:ProjectJSON = JSON.parse(data);
    const p = new Project(d.projectname);

    // load projectvars
    p._projectvars = ProjectVars.load(d.projectvars);
    p._projectimgs = ProjectImgs.load(d.projectimgs);

    BlockClassSaveLoad.setProjectVars(p._projectvars);
    BlockClassSaveLoad.setProjectImg(p._projectimgs);
    // load blocks
    for(let i = 0; i < d.blocks.length; ++i){
      const block = BlockClassSaveLoad.loadBlock(d.blocks[i].blockdata);
      p.addBlock(block, d.blocks[i].x, d.blocks[i].y);
      p._varsoncanvas = p._varsoncanvas.concat((p._blocks[i][0] as Block).getCompsContainVarOrFunc("Var"));
      p._funcsoncanvas = p._funcsoncanvas.concat((p._blocks[i][0] as Block).getCompsContainVarOrFunc("FunctionCall"));
    }


    return p;
  }

  public getProjectVars(): ProjectVars{
    return this._projectvars;
  }

  /**
   * @returns list of blocks in project and their x ,y position
   */
  public getBlocks() : [Block, number, number][] {
    return this._blocks;
  }
  public getProjectImgs(): ProjectImgs{
    return this._projectimgs;
  }

  private _blocks: [Block, number, number][] = [];
  private _projectname: string;
  private _projectvars: ProjectVars = new ProjectVars();
  private _projectimgs: ProjectImgs = new ProjectImgs();




  //Adds a var with name name to the _varsoncanvas list
  public addVarOnCanvas(name: string, block: Block) : void{
    this._varsoncanvas.push([name, block]);
  }

  //Subtracts count of var with name name in _varsoncanvas list
  public removeVarOnCanvas(name: string, block: Block) : void{
    //Check if var in the list
    for (let i = 0; i < this._varsoncanvas.length; i++) {

      //If var found: delete var
      if (this._varsoncanvas[i][0] == name && this._varsoncanvas[i][1] == block){
        this._varsoncanvas.splice(i, 1);
      }

    }
  }

  //Returns true if instance of var is on canvas
  public varOnCanvas(name: string) : boolean {
    let found = false;

    //Search name in list
    for (let i = 0; i < this._varsoncanvas.length; i++) {
      if (this._varsoncanvas[i][0] == name){
        //Highlight block for a couple of seconds
        (this._varsoncanvas[i][1] as Block).setStatus(true);
        setTimeout(() => (this._varsoncanvas[i][1] as Block).setStatus(false), 3000);

        found = true;
      }
    }

    return found;
  }

  //Adds a func with name name to the _funcsoncanvas list
  public addFuncOnCanvas(name: string, block : Block) : void {
    this._funcsoncanvas.push([name, block]);
  }

  //Subtracts count of func with name name in _funcsoncanvas list
  public removeFuncOnCanvas(name: string, block: Block) : void{
    //Check if func in the list
    for (let i = 0; i < this._funcsoncanvas.length; i++) {

      //If func found: count -= 1
      if (this._funcsoncanvas[i][0] == name && this._funcsoncanvas[i][1] == block){
        this._funcsoncanvas.splice(i, 1);
      }

    }
  }

  //Returns true if instance of func is on canvas
  public funcOnCanvas(name: string) : boolean {
    let found = false;

    //Search name in list
    for (let i = 0; i < this._funcsoncanvas.length; i++) {
      if (this._funcsoncanvas[i][0] == name){
        //Highlight block for a couple of seconds
        (this._funcsoncanvas[i][1] as Block).setStatus(true);
        setTimeout(() => (this._funcsoncanvas[i][1] as Block).setStatus(false), 3000);

        found = true;
      }
    }

    return found;
  }

  // Updates every functionCallBlock with FunctionName oldname to newname
  public updateFuncCallName(oldname: string, newname: string) : void {
    Logger.info("Updating functionCallBlocks' names.");
    Logger.debug("Updating functionCallBlocks with name:", oldname, "to:", newname);

    Logger.debug("_funcsoncanvas before update:", this._funcsoncanvas);

    //Search name in list
    for (let i = 0; i < this._funcsoncanvas.length; i++) {
      // If found, update name
      if (this._funcsoncanvas[i][0] == oldname){
        //Update block
        (this._funcsoncanvas[i][1] as FunctionCallBlock).setFunctionName(newname);
        //Update name in list
        this._funcsoncanvas[i][0] = newname;
        
      }
    }

    Logger.debug("_funcsoncanvas after update:", this._funcsoncanvas);
    Logger.info("Done updating functionCallBlocks' names.");

  }

  private _varsoncanvas: [string, Block][] = [];
  private _funcsoncanvas: [string, Block][] = [];
}
