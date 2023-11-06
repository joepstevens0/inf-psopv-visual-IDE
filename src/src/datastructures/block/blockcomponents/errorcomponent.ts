import Block from "../block";
import BlockClassSaveLoad from '../BlockClassSaveLoad';
import Logger from "@/util/logger";
import BlockComponent, {BASEJSON} from './blockcomponent';

export class ErrorComponent extends BlockComponent {
    public constructor(parentBlock : Block) {
      super("Error", parentBlock.getColor(), parentBlock);
      this._errorlist = [];
      this._timerlist = [];
    }
  
    // Returns first error of errorlist
    public getFirstError(): [string, string, Function, any[]] {
      if (this._errorlist.length > 0){
        return this._errorlist[0];
      } else {
        return ["-1", "-1", function(param : any[]) : boolean {return false}, []];
      }
    }
  
    // Adds an error to the errorlist and notifies the ErrorController
    public addError(error: [string, string, Function, any[]]): void {
  
      //Check if error is already in errorcomponent
      for (let i = 0; i < this._errorlist.length; i++){
        //If so, cancel addition
        if (this._errorlist[i][0] == error[0] && this._errorlist[i][1] == error[1]){
          Logger.info("Same error found, not adding it again.");
          Logger.debug("Error:", error, "already in _errorlist");
          return;
        }
      }
  
      //else add error
      Logger.info("Error added to errorlist in ErrorComponent. Notifying observers now for ErrorController.");
      Logger.debug("Error added to errorlist in ErrorComponent:", error);
      
      this._errorlist.push(error);
      this.getParent().notifyObservers(error.concat([this]));
    }
  
    // Deletes first encounter of err from errorlist
    public deleteError(err: [string, string, Function, any[]]) : void{
      let encountered = false
      let index = 0;
      this._errorlist.forEach(error => {
        if (!encountered){
          if (err[0] == error[0] && err[1] == error[1] && err[2] == error[2] && err[3] == error[3]){
            this._errorlist.splice(index, 1);
            encountered = true;
          }
        }
        ++index;
      });
    }
  
    // Deletes all errors from list
    public deleteAllErrors() : void {
      this._errorlist = [];
    }
  
    // Gets full errorlist
    public getErrorlist() : [string, string, Function, any[]][] {
      return this._errorlist;
    }
  
    // Sets the errorlist
    private setErrorlist(list: [string, string, Function, any[]][]): void {
      this._errorlist = list;
    }
  
    // Returns number of errors
    public errorCount(): number {
      return this._errorlist.length;
    }
  
    // Adds boolean to timerlist and returns the index
    public addTimerlist() : number {
      this._timerlist.push(false);
      return this._timerlist.length-1;
    }
  
    // Returns value of timerlist
    public getTimerBool(index : number) : boolean {
      return this._timerlist[index];
    }
  
    // Sets element on index index to value value in timerlist
    public setTimerBool(index: number, value : boolean) : void {
      this._timerlist[index] = value;
    }
  
    save(): any {
      const d : BASEJSON = super.save();
      return d;
    }
    load(data: any, parentBlock: Block): ErrorComponent {
      super.load(data, parentBlock);
      const d : BASEJSON = data;
      return this;
    }
  
    private _errorlist: [string, string, Function, any[]][];
    private _timerlist: boolean[];
  }