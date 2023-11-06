import { FlowController } from "./flowcontroller";
import { Observer, Observable } from "../../util/observer";

import Logger from "@/util/logger";
import Project from '../project/project';
import { StartComponent } from '../block/blockcomponents/blockcomponents';

export default class ExecController extends Observable implements Observer {

    public constructor(project: Project) {
        super();
        this._project = project;
    }

    public update(message: any) {
        this.notifyObservers(message);
    }

    /**
     * Start executing startblocks with a delay of 1 second
     * @param info of the startblocktype
     */
    public onStart(info: string) {

        // stop any active timeouts for the key
        if (this._timeouts.has(info)){
            clearTimeout(this._timeouts.get(info) as number);
        }

        // clear the list for the key
        if (this._flowcontrollers.has(info)){
            this.clearList(this._flowcontrollers.get(info) as FlowController[]);
            this._flowcontrollers.delete(info);
        }

        // add the block to the list of the key
        this.addStartBlocks(info);

        // start stepping every 1 second
        const f = () => {
            // if non-empty flowcontroller found, step and test again
            if (this._flowcontrollers.has(info)) {
                // step once
                if (!this.step(info)) {
                    return;
                }
                if (this._startspeed > 0)
                    this._timeouts.set(info, setTimeout(f, this._startspeed));
                else
                    f.apply([]);
            } else{
                this._timeouts.delete(info);
            }
        };
        if (this._startspeed > 0)
            this._timeouts.set(info, setTimeout(f, this._startspeed));
        else
            f.apply([]);
    }

    /**
     * Reset the execution of all startblocks, removing all highlights.
     */
    public onStop() {
        this._flowcontrollers.forEach((list: FlowController[], key: string) =>{
            this.clearList(list);
        });
        this._flowcontrollers.clear();
    }

    /**
     * stop a flowcontroller list, removing all blocks from the list
     * @param list clearing
     */
    private clearList(list: FlowController[]){
        for (let i = 0; i < list.length; ++i) {
            list[i].clear();
        }
    }
    /**
     * Add startsblock of type info, if its list is empty. Else, step once in the list
     * @param info type of startblock
     */
    public onStep(info: string) {

        if (!this._flowcontrollers.has(info) || this._flowcontrollers.get(info)?.length <= 0){
            this.addStartBlocks(info);
        }
        else {
            this.step(info);
        }
    }

    /**
     * Step once in a list for a key
     * @param key 
     */
    private step(key: string): boolean{
        // check if there is a start block on the canvas
        if (key == "start" && (typeof this._flowcontrollers.get(key) === "undefined" || this._flowcontrollers.get(key)?.length <= 0)) {
            Logger.error("No start block on canvas");
            this.update(["WARNING","Er staat nog geen startblok op het canvas."]);
            return false;
        }

        const list = this._flowcontrollers.get(key);
        if (list == undefined) return false;

        for (let i = 0; i < list.length; ++i) {
            try {
                list[i].startNext();
                if (list[i].empty()){
                    list.splice(i, 1);
                    --i;
                }
            } catch (err) {
                // This probably won't be needed
                Logger.error("Error while stepping:", err);
            }
        }
        if (list.length <= 0) this._flowcontrollers.delete(key);
        return true;
    }

    /**
     * add blocks with startcomponent for a key
     * @param key type of block with startcomponent adding
     */
    private addStartBlocks(key: string){
        const list = [];
        for (let i = 0; i < this._project.nBlocks(); ++i) {
            const block = this._project.getBlock(i);
            if (block.hasComponent("Start") && (block.getComponent("Start") as StartComponent).match(key)) {
                list.push(new FlowController(this._project));
                list[list.length - 1].setAction(this._project.getBlock(i));

            }
        }
        this._flowcontrollers.set(key, list);
    }


    public setStartSpeed(speed: number){
        this._startspeed = speed;
    }

    private _flowcontrollers: Map<string, FlowController[]> = new Map();
    private _project: Project;
    private _timeouts: Map<string, number> = new Map();
    private _startspeed = 1000;
};