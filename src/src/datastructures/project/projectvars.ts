import Block from '../block/block';

type PROJECTVARSJSON = {name: string, value: string}[];

import Logger from "@/util/logger";
import ActionController from '../controllers/actioncontroller';

export default class ProjectVars {
  /**
   * @returns total number of variables
   */
  public nVars() {
    return this._varsblocks.length;
  }

  /**
   * add a variable or update the value of a variabel
   * @param name of variable
   * @param value of variable
   * @param actioncontroller used for undo
   * @post iif variable does not exist, add it. Else update value
   */
  public setVar(name: string, value: string, actioncontroller: ActionController) {
    if (actioncontroller != null) {
      actioncontroller.addToUndoStack(this.deleteVar, this, [name, actioncontroller]);
    }

    for (let i = 0; i < this._varsblocks.length; ++i) {
      if (this._varsblocks[i].name == name) {
        this._varsblocks[i].value = value;
        Logger.debug("ProjectVars |", "variable <", name, "value updated to:", value);
        return;
      }
    }
    Logger.debug("ProjectVars |", "new variable added:", name, "with value:", value);
    this._varsblocks.push({ name, value });
  }

  /**
   * get the variabel name by index
   * @param index of variabel
   */
  public getVarName(index: number): string {
    return this._varsblocks[index].name;
  }

  /**
   * get the current value of a variable
   * @param name of variable
   * @param block the variable block
   * @returns current value of variabel <name>
   */
  public valueOf(name: string, block: Block |null= null): string {
    //Check all vars for this var
    for (let i = 0; i < this._varsblocks.length; ++i) {
      if (this._varsblocks[i].name == name)
        return this._varsblocks[i].value;
    }

    //If var still not found, but there is a block: var deleted while there was still an instance on the canvas
    if(block != null){
      // error that gets caught: Var not in projectvars
      // How to solve: check if var in projectvars

      // Create function that checks if said error is solved:
      const solveparam = [this, name];
      const solvefunc = function(param: any[]) : boolean {
          const projectvars = (param[0] as ProjectVars).getVarList();
          const name = param[1];

          //Check all projectvars for var with name name
          for (let i = 0; i < projectvars.length; ++i) {
            if (projectvars[i].name == name)
              return true;
          }

          //Else, no var, return false
          return false;
      };

      //Add error to errorlist
      (block.getComponent("Error") as ErrorComponent).addError(["ERROR", "Variabele niet toegekend! Voeg hem opnieuw toe aan de variabelen lijst.", solvefunc, solveparam]);
      Logger.error("Error while trying to use variable: Var does not exist anymore.");
    }

    //Else return empty value
    return "";
  }

  /**
   * Delete a variable
   * @param name of the variable
   * @param actioncontroller used for undo
   * @post variable <name> is deleted
   */
  public deleteVar(name: string, actioncontroller: ActionController) {
    for (let i = 0; i < this._varsblocks.length; ++i) {
      if (this._varsblocks[i].name == name) {
        actioncontroller.addToUndoStack(this.setVar, this, [name, this._varsblocks[i].value, actioncontroller]);
        this._varsblocks.splice(i, 1);
        Logger.debug("ProjectVars |", "variable with name", name, "deleted");
        return;
      }
    }

    Logger.debug("ProjectVars |", "variable deletion failed, variable with name", name, "not found");
  }

  /**
   * get all variables
   * @returns a list of all variable names and their current value
   */
  public getVarList() : { name: string, value: string }[] {
    return this._varsblocks;
  }

  /**
   * save projectvars in JSON format
   * @returns save data in JSON
   */
  public save(): any{
    const d: PROJECTVARSJSON = this._varsblocks;
    return d;
  }

  /**
   * load projectvars from json data
   * @param data created from the save() function
   * @post vars are loaded into the project
   */
  public static load(data: any): ProjectVars{
    const pv = new ProjectVars();
    pv._varsblocks = data;
    return pv;
  }

  private _varsblocks: { name: string, value: string }[] = [];
}