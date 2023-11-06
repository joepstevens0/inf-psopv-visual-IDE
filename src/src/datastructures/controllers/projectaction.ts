import Block from "../block/block";
import BlockComponent from "../block/blockcomponents/blockcomponents";

export enum Action { newBlock, deleteBlock, addBlock, removeBlock, connectBlock, unconnectBlock, 
    APIconnectBlock, APIunconnectBlock, attachBlock, detachBlock, encloseBlock, detachEnclosedBlock, inputBlock, removeInputBlock, writeText };

export default class ProjectAction {
    public constructor(action: Action, block: Block | null = null) {
        this.block = block;
        this.action = action;
    }

    public getAction(): Action {
        return this.action;
    }
    public getBlock(): Block | null {
        return this.block;
    }

    private block: Block | null;
    private action: Action;
}