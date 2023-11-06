import Block from '../block/block';
import { FunctionEncloseBlock } from '../blocks/functionblocks/functionblocks';
import Project from '../project/project';
import Logger from '@/util/logger';


export class FlowController{

    public constructor(project: Project){
        this._project = project;
    }

    public clear(){
        while(!this.empty()){
            if(this.top()[0] != null)
                this.top()[0]?.setStatus(false);
            this._actionstack.pop();
        }
    }

    public setAction(nextblock : Block | null, onFinish: Function = () => {this.endOfBlock(nextblock);}){
        // ignore ghost blocks
        if(nextblock != null && nextblock.getName() == "Ghost"){
            onFinish.apply([]);
            return;
        }

        // push next block and activate
        this._actionstack.push([nextblock,onFinish]);
        if(nextblock)
            nextblock.setStatus(true);
    }

    public startNext(){
        // if no nextblock return
        if(this.empty())
            return;
        
        const next = this.top()[0];

        // if next block empty,nothing to execute => start onfinish
        if(next == null){
            this.endOfBlock(next);
        }
        // next block is not empty, execute
        else{
            Logger.debug("FlowController |", "block executing: {name:", next.getName(), ", id:", next.getId(), "}");
            next.execute(this);
            next.setStatus(false);

            // continue if there is no next block
            if(this.top()[0] == null){
                this.startNext();
            }
        }
    }

    public endOfBlock(block : Block | null){
        if(this.empty())
            return;
        // deactivate current block
        if(this.top()[0] != null){
            this.top()[0]?.setStatus(false);
        }

        // activate onfinish function of lastblock
        if(!this.empty()){
            const f = this.top()[1];
            this._actionstack.pop();
            f.apply([]);
        }
    }

    private top() : [Block | null, Function]{
        return this._actionstack[this._actionstack.length - 1]
    }

    public empty() : boolean{
        if(this._actionstack.length == 0)
            return true;
        return false;
    }

    public startFunction(name: string, onFinish: Function){
        for(let i = 0; i < this._project.nBlocks();++i){
            const b = this._project.getBlock(i);
            if (b.getName() == "FunctionEnclose"){
                if ((b as FunctionEncloseBlock).getFunctionName() == name){
                    this.setAction(b, onFinish);
                    return;
                }
            }
        }
    }

    private _actionstack : [Block | null, Function][] = [];
    private _project: Project;
}