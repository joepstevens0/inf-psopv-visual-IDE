import { Observer, Observable } from "../../util/observer";
import Project from "../project/project";
import Logger from "@/util/logger";
import { ErrorComponent } from "../block/blockcomponents/blockcomponents";
import BlockController from "./blockcontroller";
import Block from "../block/block";
import ProjectAction, { Action } from './projectaction';




export default class ErrorController extends Observable implements Observer{
    public constructor(project: Project, blockcontroller: BlockController) {
        super();
        project.addObserver(this);
        blockcontroller.addObserver(this);
        this._allerrors = [];
        this._errorcount = 0;
        this._warningcount = 0;
    }

    update(message: any): void {
        this.notifyObservers(message);
        
        if (message instanceof Array) {
            // If new error thrown
            if (message[0] == "ERROR" || message[0] == "WARNING" || message[0] == "SUCCES"){
                Logger.info("Error apprehended in ErrorController.");
                Logger.debug("Error apprehended in ErrorController:", message);
                this.addError(message as [string, string, Function, any[], ErrorComponent]);

            // Else if block deleted
            } else if (message[0] == "BlockDeleted"){
                const block = message[1];

                Logger.debug("Checking for errors in to be deleted block:", block);

                //If the deleted block has errors or warnings, delete those
                if ( ((block as Block).getComponent("Error") as ErrorComponent).errorCount() > 0 || ((block as Block).getComponent("Error") as ErrorComponent).errorCount() > 0 ) {
                    this.deleteCertainErrors(((block as Block).getComponent("Error") as ErrorComponent));
                }

            }
        }

        // Check if errors are solved
        if (this._allerrors.length > 0){
            this.checkErrors();
        }
    }

    // Adds error to list and adds to the count
    private addError(error: [string, string, Function, any[], ErrorComponent]) {
        this._allerrors.push(error);

        if (error[0] == "ERROR") {
            this.addErrorcount();
        } else if (error[0] == "WARNING") {
            this.addWarningcount();
        }
    }


    public getErrorcount() : number{
        return this._errorcount;
    }
    private addErrorcount()  : void{
        this._errorcount += 1;
    }
    private subtractErrorcount() : void{
        this._errorcount -= 1;
    }

    public getWarningcount() : number {
        return this._warningcount;
    }
    private addWarningcount() : void {
        this._warningcount += 1;
    }
    private subtractWarningcount() : void{
        this._warningcount -= 1;
    }

    // Checks for every error if it's solved
    private checkErrors() : void{
        // Log some info
        Logger.info("Checking if errors are solved.");
        Logger.debug("All errors before solve:", this._allerrors);
        Logger.debug("Errorcount:", this._errorcount);
        Logger.debug("Warningcount:", this._warningcount);

        // Make empty arrays to keep all unsolved and solved errors
        const solved : [string, string, Function, any[], ErrorComponent][] = [];
        const unsolved : [string, string, Function, any[], ErrorComponent][]= [];

        // Check all errors if they are solved.
        this._allerrors.forEach(error => {
            if ( !( error[2](error[3]) ) ){
                unsolved.push(error);
            } else {
                solved.push(error);
            }
        });

        Logger.debug("Errors that are solved:", solved);
        Logger.debug("Errors that are unsolved:", unsolved);
        Logger.info("Deleting solved errors.");

        // Delete every solved error
        solved.forEach(error => {
            // Delete error from component
            const comp : ErrorComponent = error[4];
            const err : [string, string, Function, any[]] = error.slice(0, 4);
            comp.deleteError(err);

            Logger.debug("Deleted error:", err, "from component:", comp);

            // Subtract number from count if error or warning
            if (error[0] == "ERROR") {
                this.subtractErrorcount();
            } else if (error[0] == "WARNING") {
                this.subtractWarningcount();
            }
        });

        // Save all not solved errors in the errorarray
        this._allerrors = unsolved;

        Logger.debug("All errors after solve:", this._allerrors);
        Logger.debug("Errorcount:", this._errorcount);
        Logger.debug("Warningcount:", this._warningcount);
    }

    // Deletes errors of a certain errorcomponent
    private deleteCertainErrors(comp: ErrorComponent) : void {
        Logger.info("Deleting errors of a certain component.");
        Logger.debug("All errors:", this._allerrors, "before deletion of errors from component:", comp);

        const keep : [string, string, Function, any[], ErrorComponent][] = [];

        this._allerrors.forEach(error => {
            //Add every error not from the component to keep
            if (error[4] !== comp){
                keep.push(error);

            //else don't remember the error and subtract the total count.
            } else {
                if (error[0] == "ERROR") {
                    this.subtractErrorcount();
                } else if (error[0] == "WARNING") {
                    this.subtractWarningcount();
                }
            }
        });

        //Delete all errors from the component, so it works when undo is used
        comp.deleteAllErrors();

        //Replace the array with keep.
        this._allerrors = keep;

        Logger.debug("All errors:", this._allerrors, "before deletion of errors from component:", comp);
    }

    public getErrors(): string[] {
        const list  = [];
        for (let i = 0; i < this._allerrors.length;++i){
            if (this._allerrors[i][0] == "ERROR") list.push(this._allerrors[i][1]);
        }
        return list;
    }
    public getWarnings(): string[] {
        const list  = [];
        for (let i = 0; i < this._allerrors.length;++i){
            if (this._allerrors[i][0] == "WARNING") list.push(this._allerrors[i][1]);
        }
        return list;
    }

    private _allerrors: [string, string, Function, any[], ErrorComponent][];
    private _errorcount: number;
    private _warningcount: number;
}