import Block from "../block/block";
import ProjectAction, { Action } from './projectaction';
import { Observable } from '@/util/observer';
import Logger from "@/util/logger";

import {
    AttachComponent,
    EnclosureComponent,
    InputComponent,
    ErrorComponent,
    ConnectComponent,
    APIConnectComponent,
    ReturnComponent,
} from "../block/blockcomponents/blockcomponents";
import DragController from './dragcontroller';
import ActionController from './actioncontroller';
import Project from '../project/project';
import { FunctionCallBlock, FunctionEncloseBlock, GhostBlock, VarBlock } from '../blocks/blockclasses';


export default class BlockController extends Observable {
    public constructor(project: Project, dragcontroller: DragController, actioncontroller: ActionController) {
        super();

        this._dragcontroller = dragcontroller;
        this._actioncontroller = actioncontroller;
        this._project = project;
    }

    /**
     * Select a new block for the first time
     * @param block new block
     * @param offset select offset
     * @post block is selected
     */
    public newBlock(block: Block, offset: [number, number] = [0, 0]) {
        //If new var, save var to list in project
        if (block.getName() == "Var"){
            this._project.addVarOnCanvas((block as VarBlock).getVarName(), block);
        }
        //If new functioncall, save functioncall to list in project
        else if (block.getName() == "FunctionCall"){
            this._project.addFuncOnCanvas((block as FunctionCallBlock).getFunctionName(), block);
        }

        if (block.hasComponent("Connect") || block.hasComponent("APIConnect")) {
            //hard code offset from connectComponent
            offset = [offset[0], offset[1] - 40];
        }

        //Actually add the block
        this._dragcontroller.selectBlock(block, offset);
        this._actioncontroller.addToUndoStack(this.deleteSelectedBlock, this, [block]);
        this.notifyObservers(new ProjectAction(Action.newBlock, block));
        Logger.debug("BlockController |", "newBlock:", block);
    }

    /**
     * delete the selected block
     * @post selected block is deleted
     */
    public deleteSelectedBlock() {
        let deletionCanceled = false;

        //If functionEnclosureBlock is deleted, check if there are still instances of function on the canvas
        if (this._dragcontroller.getSelectedBlock().getName() == "FunctionEnclose"){
            Logger.info("Trying to delete a function. Checking instances on canvas.");
            Logger.debug("Trying to delete functionBlock:", this._dragcontroller.getSelectedBlock());

            // If there are still instances on canvas: pop-up and cancel deletion.
            if (this.funcinstanceOnCanvas((this._dragcontroller.getSelectedBlock() as FunctionEncloseBlock).getFunctionName())) {
                Logger.info("Deletion cancelled, instances of function found on canvas.");

                //Notify with pop-up
                this.notifyObservers("FuncDel cancelled");

                deletionCanceled = true;
            } else {
                Logger.info("No instance found, deleting function.");
            }
        }


        //If var deleted, update list in project
        let varstobedeleted = [] as [string, Block][];
        varstobedeleted = this._dragcontroller.getSelectedBlock().getCompsContainVarOrFunc("Var");

        for (let i = 0; i < varstobedeleted.length; i++) {
            this._project.removeVarOnCanvas(varstobedeleted[i][0], varstobedeleted[i][1]);
        }

        //If FunctionCall deleted, update list in project
        let funccallstobedeleted = [] as [string, Block][];
        funccallstobedeleted = this._dragcontroller.getSelectedBlock().getCompsContainVarOrFunc("FunctionCall");

        for (let j = 0; j < funccallstobedeleted.length; j++) {
            this._project.removeFuncOnCanvas(funccallstobedeleted[j][0], funccallstobedeleted[j][1]);
        }

        // Delete errors of every block with errorcomponent that gets deleted
        let errorstobedeleted = [] as Block[];
        errorstobedeleted = this._dragcontroller.getSelectedBlock().getCompsContainErrors();
        for (let k = 0; k < errorstobedeleted.length; k++){
            this.notifyObservers(["BlockDeleted", errorstobedeleted[k]]);
        }
        
        //Actually delete the block
        Logger.debug("BlockController |", "deleteSelectedBlock");
        
        this._actioncontroller.addToUndoStack(this.newBlock, this, [this._dragcontroller.getSelectedBlock(), this._dragcontroller.getSelectedOffset()]);
        this._dragcontroller.removeSelectedBlock();

        this.notifyObservers(new ProjectAction(Action.deleteBlock, this._dragcontroller.getSelectedBlock()));

        //If deletion is canceled in case of function, undo deletion
        //Undo deletion is used instead of just canceling deletion, because deletion can be forced by grabbing a block out of a blocklist while holding functionblock.
        if (deletionCanceled) {
            //Undo deletion
            this._actioncontroller.onUndo();
            //Undo picking the block up
            this._actioncontroller.onUndo();
        }
    }

    /**
     * place a block on the canvas
     * @param block placed
     * @param x position on canvas
     * @param y position on canvas
     * @post block is placed on the canvas at pos (x,y)
     * @post selected block is removed
     */
    public addBlock(block: Block, x = 0, y = 0) {
        Logger.debug("BlockController |", "addBlock to canvas:", block, "position:", [x,y]);

        //If functionEnclosureBlock, check if it's a new block
        if (block.getName() == "FunctionEnclose"){
            //If it's new, ask for a name, else ignore
            if ((block as FunctionEncloseBlock).getFunctionName() == ""){
                Logger.info("New FunctionEnclose placed on canvas, asking for name now.");

                //Make pop-up to add name
                this.notifyObservers(["FunctionEnclose namechange", block]);
            }
        }

        //Add block to the canvas
        this._project.addBlock(block, x, y);

        this._actioncontroller.addToUndoStack(this.removeBlock, this, [block, this._dragcontroller.getSelectedOffset()]);

        this._dragcontroller.removeSelectedBlock();

        this.notifyObservers(new ProjectAction(Action.addBlock, block));
    }

    /**
     * remove a block from the canvas
     * @param block removed
     * @param offset selection offset
     * @post block is removed from the canvas
     * @post block is selected
     */
    public removeBlock(block: Block, offset: [number, number] = [0, 0]) {
        Logger.debug("BlockController |", "removeBlock from canvas:", block);

        const index = this._project.blockIndex(block);
        if (index < 0)
            return;
        this._actioncontroller.addToUndoStack(this.addBlock, this, [block, this._project.getBlockX(index), this._project.getBlockY(index)]);

        this._project.removeBlock(index);

        if (block.hasComponent("Connect") || block.hasComponent("APIConnect")) {
            //hard code offset from connectComponent
            offset = [offset[0], offset[1] - 40];
        }

        this._dragcontroller.selectBlock(block, offset);

        this.notifyObservers(new ProjectAction(Action.removeBlock, block));
    }

    /**
     * connect a block to a connectcomponent
     * @param block connecting
     * @param connectcomp component connecting to
     * @param blockheight height of block
     * @post block is placed on the canvas
     * @post block of connectcomp is attached to block
     */
    public connectBlock(block: Block, connectcomp: ConnectComponent, blockheight: number){
        Logger.debug("BlockController |","connecting block:", block, "to component:", connectcomp);

        const otherblock = connectcomp.getParent();

        // get new block position
        const index = this._project.blockIndex(otherblock);
        const x = this._project.getBlockX(index);
        const y = this._project.getBlockY(index) - blockheight;

        // place block on canvas
        this._project.addBlock(block,x, y);

        // remove other block from canvas
        this._project.removeBlock(index);

        // get lowest attach component
        let attachcomp = block.getComponent("Attach") as AttachComponent;
        while(attachcomp.getNext() != null){
            attachcomp = attachcomp.getNext()?.getComponent("Attach") as AttachComponent;
        }

        // attach otherblock to block
        attachcomp.setNext(otherblock);

        // unselect block
        this._dragcontroller.removeSelectedBlock();

        // add to undo stack
        this._actioncontroller.addToUndoStack(this.disconnectBlock, this, [block, blockheight, this._dragcontroller.getSelectedOffset()]);

        // notify observers
        this.notifyObservers(new ProjectAction(Action.connectBlock, otherblock));
    }
    /**
     * disconnect a block from an connectcomponent
     * @param block disconnecting
     * @param blockheight height of block
     * @param offset selection offset
     * @post block is selected
     * @post blocks in block attachcomponent are placed on the canvas
     */
    public disconnectBlock(block: Block, blockheight: number, offset: [number, number] = [0, 0]){
        Logger.debug("BlockController |","Disconnecting block:" , block);


        const index = this._project.blockIndex(block);

        // add child block to canvas
        const childblock = (block.getComponent("Attach") as AttachComponent).getNext();
        if (childblock != null){
            // add childblock to canvas
            const x = this._project.getBlockX(index);
            const y = this._project.getBlockY(index) + blockheight;
            this._project.addBlock(childblock, x, y);
        }

        // disconnect child
        (block.getComponent("Attach") as AttachComponent).setNext(null);

        // remove block from canvas
        this._project.removeBlock(index);

        if (block.hasComponent("Connect") || block.hasComponent("APIConnect")) {
            //hard code offset from connectComponent
            offset = [offset[0], offset[1] - 40];
        }

        // select removed block
        this._dragcontroller.selectBlock(block, offset);

        this._actioncontroller.addToUndoStack(this.connectBlock, this, [block, childblock?.getComponent("Connect") as ConnectComponent, blockheight]);
        this.notifyObservers(new ProjectAction(Action.unconnectBlock, block));
    }

    /**
     * connect a API block to a connectcomponent
     * @param block connecting
     * @param connectcomp component connecting to
     * @param blockheight height of block
     * @post block is placed on the canvas
     * @post block of apiconnectcomp is attached to block
     */
    public APIconnectBlock(block: Block, connectcomp: APIConnectComponent, blockheight: number){
        Logger.debug("BlockController |","connecting api block:", block, "to api component:", connectcomp);

        const otherblock = connectcomp.getParent();

        // get new block position
        const index = this._project.blockIndex(otherblock);
        const x = this._project.getBlockX(index);
        const y = this._project.getBlockY(index) - blockheight;

        // place block on canvas
        this._project.addBlock(block,x, y);

        // remove other block from canvas
        this._project.removeBlock(index);

        // get lowest attach component
        let attachcomp = block.getComponent("APIAttach") as AttachComponent;
        while(attachcomp.getNext() != null){
            attachcomp = attachcomp.getNext()?.getComponent("APIAttach") as AttachComponent;
        }

        // attach otherblock to block
        attachcomp.setNext(otherblock);

        // unselect block
        this._dragcontroller.removeSelectedBlock();

        // add to undostack
        this._actioncontroller.addToUndoStack(this.APIdisconnectBlock, this, [block, blockheight, this._dragcontroller.getSelectedOffset()]);

        // notify observers
        this.notifyObservers(new ProjectAction(Action.APIconnectBlock, otherblock));
    }

    /**
     * disconnect a API block from an connectcomponent
     * @param block disconnecting
     * @param blockheight height of block
     * @param offset selection offset
     * @post block is selected
     * @post blocks in block apiattachcomponent are placed on the canvas
     */
    public APIdisconnectBlock(block: Block, blockheight: number, offset: [number, number] = [0, 0]){
        Logger.debug("BlockController |","Disconnecting api block:" , block);

        const index = this._project.blockIndex(block);

        // add child block to canvas
        const childblock = (block.getComponent("APIAttach") as AttachComponent).getNext();
        if (childblock != null){
            // add childblock to canvas
            const x = this._project.getBlockX(index);
            const y = this._project.getBlockY(index) + blockheight;
            this._project.addBlock(childblock, x, y);
        }

        // disconnect child
        (block.getComponent("APIAttach") as AttachComponent).setNext(null);

        // remove block from canvas
        this._project.removeBlock(index);

        // select removed block
        this._dragcontroller.selectBlock(block, offset);

        // add to undo stack
        this._actioncontroller.addToUndoStack(this.APIconnectBlock, this, [block, childblock?.getComponent("APIConnect") as ConnectComponent, blockheight]);

        // notify observers
        this.notifyObservers(new ProjectAction(Action.APIunconnectBlock, block));
    }

    /**
     * Attach a block in an attachcomponent
     * @param block that gets attached
     * @param attachcomp component attached to
     * @post block is attached to the attachcomp
     * @post selected block is removed
     */
    public attachBlock(block: Block, attachcomp: AttachComponent) {
        Logger.debug("BlockController |", "attaching block:", block, "to component:", attachcomp);

        if (block == attachcomp.getParent()) return;
        
        if (attachcomp.getParent().getName() == "FunctionEnclose")
            return;

        attachcomp.setNext(block);

        if (this._project.blockIndex(block) > -1) {
            this._project.removeBlock(this._project.blockIndex(block));
        }
        this._dragcontroller.removeSelectedBlock();

        this._actioncontroller.addToUndoStack(this.detachBlock, this, [attachcomp, this._dragcontroller.getSelectedOffset()]);

        this.notifyObservers(new ProjectAction(Action.attachBlock, attachcomp.getParent()));
    }

    /**
     * detach a block from an attachcomponent
     * @param attachcomp attach component detached from
     * @param offset selection offset
     * @post attachcomponten attached block is removed
     * @post removed block is selected
     */
    public detachBlock(attachcomp: AttachComponent, offset: [number, number] = [0, 0]) {
        Logger.debug("BlockController |", "detaching block from component:", attachcomp);
        if (attachcomp.getParent().getName() == "FunctionEnclose") {
            const parent = attachcomp.getParent() as FunctionEncloseBlock;
            if (parent.isFirst()) {
                // offset = [offset[0], offset[1] - 40];
            }
            offset = [offset[0], offset[1] + 40];
            this.functionDetach(attachcomp, offset);
            return;
        }

        const block = attachcomp.getNext() as Block;
        attachcomp.setNext(null);

        this._dragcontroller.selectBlock(block, offset);

        this._actioncontroller.addToUndoStack(this.attachBlock, this, [block, attachcomp]);

        this.notifyObservers(new ProjectAction(Action.detachBlock, block));
    }

    /**
     * Place a block in an enclosecomponent
     * @param block placed in enclosecomponent
     * @param enclosecomp component placed in
     * @post block is placed in enclosecomp
     * @post selected block is removed
     */
    public encloseBlock(block: Block, enclosecomp: EnclosureComponent) {
        Logger.debug("BlockController |", "enclosing block:", block, "in component:", enclosecomp);

        enclosecomp.setFirstBlock(block);

        if (this._project.blockIndex(block) > -1) {
            this._project.removeBlock(this._project.blockIndex(block));
        }
        this._dragcontroller.removeSelectedBlock();

        this._actioncontroller.addToUndoStack(this.detachEnclosedBlock, this, [enclosecomp, this._dragcontroller.getSelectedOffset()]);

        this.notifyObservers(new ProjectAction(Action.encloseBlock, enclosecomp.getParent()));
    }

    /**
     * detach an enclosedblock from an enclosecomponent
     * @param enclosecomp enclosecomponent detached from
     * @param offset selection offset
     * @post attached block is removed from enclosecomp
     * @post removed block is selected 
     */
    public detachEnclosedBlock(enclosecomp: EnclosureComponent, offset: [number, number] = [0, 0]) {
        Logger.debug("BlockController |", "detaching enclosed block from component:", enclosecomp);

        const block = enclosecomp.getFirstBlock() as Block;
        enclosecomp.setFirstBlock(null);

        this._dragcontroller.selectBlock(block, offset);

        this._actioncontroller.addToUndoStack(this.encloseBlock, this, [block, enclosecomp]);

        this.notifyObservers(new ProjectAction(Action.detachEnclosedBlock, block));
    }

    /**
     * Place a block in an inputcomponent
     * @param block placed in inputcomponent
     * @param inputComp component placing in
     * @post block is placed in inputComp
     * @post selected block is removed
     */
    public inputBlock<T>(block: Block, inputComp: InputComponent<T>) {
        Logger.debug("BlockController |", "placing block:", block, "in inputcomponent:", inputComp);
        try {
            let ghostext = "";
            // if component has ghostblock, reset its text
            if (inputComp.getBlock()?.getName() == "Ghost"){ 
                const ghostreturn = (inputComp.getBlock().getComponent("Return") as ReturnComponent<string>);
                inputComp.setBlock(block);
                ghostext = ghostreturn.getValue() as string;
                ghostreturn.setValue("");
            } else{
                inputComp.setBlock(block);
            }

            if (this._project.blockIndex(block) > -1) {
                this._project.removeBlock(this._project.blockIndex(block));
            }
            this._dragcontroller.removeSelectedBlock();

            this._actioncontroller.addToUndoStack(this.removeInput as <T>(inputComp: InputComponent<T>) => void, this, [inputComp, this._dragcontroller.getSelectedOffset(), ghostext]);

            this.notifyObservers(new ProjectAction(Action.inputBlock, inputComp.getParent()));

        } catch (err) {
            // error that gets caught: block that was tried to use as input does not have the right type
            // How to solve: check if the inputcomponent has the right type.

            // Create function that checks if said error is solved:
            const solveparam = [inputComp];
            const solvefunc = function(param: InputComponent<T>[]) : boolean {
                const inputcomp = param[0];

                if (inputcomp.getBlock()?.hasComponent("Return")) {
                    //If it's a ghostblock, type of input needs to be checked
                    if (inputcomp.getBlock().getName() == "Ghost"){ 
                        const val = (inputcomp.getBlock().getComponent("Return") as ReturnComponent<T>).getValue();
              
                        // Try to cast the value to the wanted type of value
                        const castval = inputcomp.cast(val);
                  
                        // If the cast fails, create an errormessage
                        if (castval === null){
                            return false;
                        } else {
                            return true;
                        }
                    // Else if it's an already connected block, that means it's a valid block
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            };

            // Add error to errorlist
            // block.getComponent("Error") does not work in this situation. Since block is being holded, errorcontroller can't be reached.
            (inputComp.getParent().getComponent("Error") as ErrorComponent).addError(["ERROR", err.message, solvefunc, solveparam]);
            Logger.error("Error while inputting block:", err.message);

        }
    }

    /**
     * Remove a block from an inputcomponent
     * @param inputComp component removed from
     * @param offset selection offset
     * @param ghosttext new text in ghostblock
     * @post block in inputComp is removed
     * @post removed block is selected
     * @post ghosttext is set in ghostblock if available
     */
    public removeInput<T>(inputComp: InputComponent<T>, offset: [number, number] = [0, 0], ghosttext = "") {
        Logger.debug("BlockController |", "removing block from inputcomponent:", inputComp);

        const block = inputComp.getBlock() as Block;
        inputComp.setBlock(null);

        if (inputComp.getBlock() != null && inputComp.getBlock()?.getName() == "Ghost"){ 
            (inputComp.getBlock()?.getComponent("Return") as ReturnComponent<string>).setValue(ghosttext);
        }

        this._dragcontroller.selectBlock(block, offset);

        this._actioncontroller.addToUndoStack(this.inputBlock as <T>(block: Block, inputComp: InputComponent<T>) => void, this, [block, inputComp]);

        this.notifyObservers(new ProjectAction(Action.removeInputBlock, block));
    }

    /**
     * Detach an FunctionCallBlock from an FunctionEncloseBlock
     * @param attachcomp attachcomponent of FunctionEncloseBlock
     * @param offset selection offset
     * @post new FunctionCallBlock is created en selected
     */
    private functionDetach(attachcomp: AttachComponent, offset: [number, number] = [0, 0]) {
        const b = attachcomp.getNext() as FunctionCallBlock;
        b.activate();
        this.newBlock(b, offset);
        attachcomp.setNext(null);
        setTimeout(() => { (attachcomp.getParent() as FunctionEncloseBlock).attachCallBlock(); }, 500);
    }

    /**
     * write text in ghostblock
     * @param ghost GhostBlock writing to
     * @param text writing in ghost
     * @post text writtin in ghostblock
     */
    public writeText<T>(inputcomp: InputComponent<T>, text:string){
        Logger.debug("BlockController |","Changing Ghostblock text to:", text);

        const ghost = inputcomp.getBlock();
        if (ghost == null) return;

        // get return component
        const returncomp = ghost.getComponent("Return") as ReturnComponent<string>;

        const oldtext = returncomp.getValue() as string;    // save old text for undo

        // write text
        (returncomp).setValue(text);

        // add to undo stack
        this._actioncontroller.addToUndoStack(this.writeText, this, [inputcomp,oldtext]);

        // notify observers
        this.notifyObservers(new ProjectAction(Action.writeText, inputcomp.getParent()));
    }

    /**
     * Returns true if there is still an instance of var with name name on canvas
     * @param name name of var that needs to be checked for
     */
    public varinstanceOnCanvas(name : string) : boolean {
        return this._project.varOnCanvas(name);
    }
    /**
     * Returns true if there is still an instance of function with name name on canvas
     * @param name name of function that needs to be checked for
     */
    public funcinstanceOnCanvas(name : string) : boolean {
        return this._project.funcOnCanvas(name);
    }
    /**
     * Returns true if function already exists in project
     */
    public funcExists(name: string) : boolean {
        // Check every block if functionEnclose with name name
        for (let i = 0; i < this._project.getBlocks().length; i++){
            // If functionEnclose
            if (this._project.getBlocks()[i][0].getName() == "FunctionEnclose"){
                // If FunctionName == name
                if ( (this._project.getBlocks()[i][0] as FunctionEncloseBlock).getFunctionName() == name ){
                    return true;
                }
            }
        }

        return false;
    }

    private _dragcontroller: DragController;
    private _actioncontroller: ActionController;
    private _project: Project;
};