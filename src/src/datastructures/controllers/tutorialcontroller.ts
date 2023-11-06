
import { Observer } from "@/util/observer"

import ProjectController from "@/datastructures/controllers/projectcontroller";
import ProjectAction, { Action } from "./projectaction";
import Block from '../block/block';
import Logger from '@/util/logger';

export default class TutorialController implements Observer {

    private tutorialname = "";
    private steps: string[] = [];
    private currentstep = 0;
    private message = "";
    private highlighted = "";
    private condition = "";
    private createRef = ""; // if string not "" => next condition met creates ref for first block
    private nextbutton = false;
    private completedSteps: string[] = [];
    private projcontroller: ProjectController | null = null;
    private blockrefs: Map<string, Block> = new Map<string, Block>();
    private undoAction = false;
    private actionComplete = false;

    public getName(): string {
        return this.tutorialname;
    }
    public getMessage(): string {
        return this.message;
    }
    public getHighlight(): string {
        return this.highlighted;
    }
    public getCondition(): string {
        return this.condition;
    }
    public hasNextbutton(): boolean {
        return this.nextbutton;
    }
    public getCompleted(): string[] {
        return this.completedSteps;
    }
    public getRef(name: string): Block | undefined {
        return this.blockrefs.get(name);
    }
    public started(): boolean {
        return this.steps.length > 0;
    }
    public finished(): boolean {
        return this.currentstep >= this.steps.length && this.started();
    }
    public isActionComplete(): boolean {
        return this.actionComplete;
    }

    /**
     * Go the the next step if target mouseclick completes step
     * @returns true if click completes step
     */
    public onClick(): boolean {
        if (this.condition == "click") {
            this.next();
            return true;
        }
        return false;
    }

    /**
     * Go the the next step if target mouserelease completes step
     * @returns true if click completes step
     */
    public onRelease(): boolean {
        if (this.condition == "release") {
            this.next();
            return true;
        }
        return false;
    }

    public update(message: any) {
        if (this.message != null && message instanceof ProjectAction) {
            this.onAction(message);
        }
    }
    public setController(projcontroller: ProjectController) {
        this.projcontroller?.removeObserver(this);
        this.projcontroller = projcontroller;
        projcontroller?.addObserver(this);
    }


    /**
     * Go to the next step if action completes step
     * @param action tested
     * @returns true if action completes step
     */
    private onAction(action: ProjectAction): boolean {
        if (!this.started() || this.undoAction) return false;

        // next step if correct action
        if (this.testAction(action)) {
            Logger.debug("Tutorial |", "Required action for tutorial completed:", this.condition);
            this.actionComplete = true;
            if (this.createRef != "") {
                if (action.getBlock() != null)
                    this.blockrefs.set(this.createRef, action.getBlock() as Block);
            }
            if (this.condition != "writeText")
                this.next();
            return true;
        }
        if (this.condition != "writeText") return false;
        // undo if wrong action
        this.undoAction = true;
        this.projcontroller?.getActionController().onUndo();
        this.undoAction = false;
        
        return false;

    }
    /**
     * test if action completes step
     * @param action tested action
     * @returns true if action completes step
     */
    private testAction(action: ProjectAction): boolean{
        // test if correct action
        if (Action[action.getAction()] != this.condition){
            Logger.debug("Tutorial |", "Wrong action:", Action[action.getAction()], "| Required action:", this.condition, "| undoing action...");
            return false;
        }

        if (this.highlighted.split(">").length > 1){

            // test if correct block in blocklist
            if (this.highlighted.startsWith("blocklist")){
                const targetblock =  this.highlighted.split(">")[1];
                if (targetblock != action.getBlock()?.getName()){
                    Logger.debug("Tutorial |", "Wrong target:", action.getBlock()?.getName(), "| Required target:", targetblock, "| undoing action...");
                    return false;
                }
            }

            // test if correct block on canvas
            if (this.highlighted.startsWith("block>")){
                const targetblock =  this.getRef(this.highlighted.split(">")[1]);
                if (targetblock != action.getBlock()){
                    Logger.debug("Tutorial |", "Wrong target:", action.getBlock(), "| Required target:", targetblock, "| undoing action...");
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * start a tutorial
     * @param data tutorial information
     */
    public start(name: string, data: string) {
        this.tutorialname = name;
        // remove all steps
        this.clear();

        // store steps
        this.steps = data.split("|");

        // show first step
        this.showStep(0);
    }

    /**
     * stop the tutorial
     */
    public stop() {
        this.clear();
    };

    /**
     * start the next step of the tutorial
     */
    public next(): void {
        Logger.debug("Tutorial |", "Preparing next step");

        // save step in completed list
        this.completedSteps.push(this.message);

        // stop last step
        this.stopCurrentStep();

        ++this.currentstep;

        // return if finished
        if (this.finished()) {
            return;
        }

        // skip empty steps
        if (this.steps[this.currentstep] == "") {
            return this.next();
        }
        // show next step
        this.showStep(this.currentstep);
    };
    /**
   * clear tutorial removing all steps and refs
   */
    private clear() {
        this.stopCurrentStep();
        this.blockrefs.clear();
        this.steps = [];
        this.currentstep = 0;
        this.completedSteps = [];
    };

    /**
   * show a step in the current tutorial
   */
    private showStep(index: number) {
        this.currentstep = index;
        const stepinfo = this.steps[this.currentstep];

        const Actions = stepinfo.split("\n");
        for (let i = 0; i < Actions.length; ++i) {
            const s = Actions[i].split(":");
            let arg = Actions[i].substr(Actions[i].indexOf(":") + 1);
            switch (s[0]) {
                case "m":
                    while (arg[arg.length - 1] != "'" && i + 1 < Actions.length) {
                        arg += "\n" + Actions[i + 1];
                        ++i;
                    }
                    this.message = arg.substr(1, arg.length - 2);
                    break;
                case "h":
                    this.highlighted = arg;
                    break;
                case "c":
                    this.setCondition(arg);
                    break;
                case "n":
                    this.nextbutton = true;
                    break;
            }
        }
        Logger.debug("Tutorial |", "step shown:", stepinfo);
    };

    private setCondition(conditioninfo: string) {
        const s = conditioninfo.split(">");
        this.condition = s[0];

        if (s.length > 1) {
            this.createRef = s[1];
        }
        this.actionComplete = false;
        if (this.condition == "") this.actionComplete = true;
    };
    /**
     * stop the currently active step
     */
    private stopCurrentStep() {
        Logger.debug("Tutorial |", "Stopping current step");

        this.message = "";
        this.createRef = "";
        this.nextbutton = false;
        this.condition = "";
        this.highlighted = "";
        this.actionComplete = true;
    };
};