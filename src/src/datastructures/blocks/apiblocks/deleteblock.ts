import Block from "../../block/block";
import {
  AttachComponent,
  InputComponent,
  LabelComponent,
  ConnectComponent,
  BreakComponent,
  ErrorComponent,
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';
import Logger from "@/util/logger";

const axios = require('axios').default;

import colors from "@/assets/standardcolors.json"
import { GhostBlock } from '../basicblocks/basicblocks';
const _color = (colors as any).apiblocks;
import {responselist} from "./responselist";


// DELETE works (gives correct response)
export class DELETEBlock extends Block {
  public constructor() {
    super("DELETE", _color);
    //Top
    this._connect = new ConnectComponent(this);
    this.addComponent(this._connect);

    //Bottom
    this._attach = new AttachComponent(this.getColor(), this);
    this.addComponent(this._attach);

    //Base
    this._label = new LabelComponent(this);
    this._label.setText("Verwijder data (DELETE)");
    this.addComponent(this._label);

    this.addComponent(new BreakComponent(this));

    this._label2 = new LabelComponent(this);
    this._label2.setText("link");
    this.addComponent(this._label2);

    this._input = new InputComponent<string>(this, "string");
    this._input.setDefault(new GhostBlock());
    this.addComponent(this._input);

    this._error = new ErrorComponent(this);
    this.addComponent(this._error);

  }

  public execute(flowcontroller : FlowController): void {
    flowcontroller.setAction(this._input.getBlock(), async () => {

      // If link is set
      if (this._input.getValue() != undefined){
        //Try to execute request
        await axios.delete(this._input.getValue())
        .then((response) => {
          //Handle succes

          // error that gets caught: Succes!
          // How to solve: delete after 5 seconds
          
          //Create boolean on timerlist of errorcomponent
          const index = this._error.addTimerlist();
          const solveparam = [this._error, index];
          const solvefunc = function(param: any[]) {
            const comp = param[0];
            const index = param[1];

            //Make sure function returns true after 5 seconds
            setTimeout(function() { (comp as ErrorComponent).setTimerBool(index, true) }, 5000);
            return (comp as ErrorComponent).getTimerBool(index);
          }

          // Add succesnotification to the errorlist
          this._error.addError(["SUCCES", "Het verwijderen van informatie is gelukt!", solvefunc, solveparam]);
          Logger.info("DELETE-request succesful, response:", response);
        })

        //If response fails
        .catch((error) => {
          //Handle error

          // error that gets caught: error from api
          // How to solve: not an error we can fix, delete after 10 seconds
          
          //Create boolean on timerlist of errorcomponent
          const index = this._error.addTimerlist();
          const solveparam = [this._error, index];
          const solvefunc = function(param: any[]) {
            const comp = param[0];
            const index = param[1];

            //Make sure function returns true after 5 seconds
            setTimeout(function() { (comp as ErrorComponent).setTimerBool(index, true) }, 10000);
            return (comp as ErrorComponent).getTimerBool(index);
          }

          //Add error to errorlist
          this._error.addError(["ERROR", responselist[error.response.status], solvefunc, solveparam]);
          Logger.error("DELETE-request error:", error);
        });
        
      // If link is not set
      } else {

        // error that gets caught: Link not set
        // How to solve: check if there is input.

        // Create function that checks if said error is solved:
        const solveparam = [this._input];
        const solvefunc = function(param: InputComponent<string>[]) : boolean {
            const inputcomp = param[0];

            if (inputcomp.getBlock()?.hasComponent("Return")) {
                //If it's a ghostblock, as long as there is input, it's ok
                if (inputcomp.getBlock().getName() == "Ghost"){ 
              
                    // Check if there is input
                    if ((inputcomp.getBlock().getComponent("Return") as ReturnComponent<string>).getValue() == undefined) {
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

        //Add error to errorlist
        this._error.addError(["ERROR", "De link voor DELETE is niet gezet.", solvefunc, solveparam]);
        Logger.error("DELETE-request error: link not set");
      }
    
      flowcontroller.setAction(this._attach.getNext());        
    });
  }

  private _connect: ConnectComponent;
  private _attach: AttachComponent;
  private _label: LabelComponent;
  private _label2: LabelComponent;
  private _input: InputComponent<string>;
  private _error: ErrorComponent;
}

