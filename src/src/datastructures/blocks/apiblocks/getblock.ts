import Block from "../../block/block";
import {
  InputComponent,
  LabelComponent,
  ReturnComponent,
  BreakComponent,
  ErrorComponent
} from "../../block/blockcomponents/blockcomponents";

import { FlowController } from '../../controllers/flowcontroller';

import Logger from "@/util/logger";

const axios = require('axios').default;

import colors from "@/assets/standardcolors.json"
import {responselist} from "./responselist";
import { GhostBlock } from '../basicblocks/basicblocks';
const _color = (colors as any).apiblocks;

// GET works IF request returns JSON with 1 object AND returns value of requested field as string
export class GETBlock extends Block {
  public constructor() {
    super("GET", _color);

    //Base
    this._label = new LabelComponent(this);
    this._label.setText("Haal data op (GET)");
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

    this.addComponent(new BreakComponent(this));

    this._label3 = new LabelComponent(this);
    this._label3.setText("veld");
    this.addComponent(this._label3);

    this._input2 = new InputComponent<string>(this, "string");
    this._input2.setDefault(new GhostBlock());
    this.addComponent(this._input2);

    this._return = new ReturnComponent<string>(this, "string");
    this.addComponent(this._return);
  }

  public execute(flowcontroller : FlowController): void {
    flowcontroller.setAction(this._input.getBlock(), () => { flowcontroller.setAction(this._input2.getBlock(), async () => {

      // If link is set
      if (this._input.getValue() != undefined){
        //Try execution of request
        await axios.get(this._input.getValue())
        .then((response) => {
          
          //If field is set
          if (this._input2.hasValue()){
            //If field valid
            if (response['data'][this._input2.getValue() as string] != undefined){
              // handle success

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

              // Add succesnotification to errorlist
              this._error.addError(["SUCCES", "Het ophalen van informatie is gelukt!", solvefunc, solveparam]);
              Logger.info("GET-request succesful, response:", response);

              //Add response of field to returncomponent
              this._return.setValue(response['data'][this._input2.getValue() as string] as string);

            //If field not valid
            } else {

              // error that gets caught: invalid field
              // How to solve: check if field changes.

              // Create function that checks if said error is solved:
              const solveparam = [this._input2, this._input2.getValue()];
              const solvefunc = function(param: any[]) : boolean {
                  const inputcomp = param[0];
                  const oldinput = param[1];

                  if (inputcomp.getValue() != oldinput){
                    return true;
                  } else {
                    return false;
                  }
              };

              //Add error to errorlist
              this._error.addError(["ERROR", "Het veld was niet geldig.", solvefunc, solveparam]);
              Logger.error("GET-request error:", this._input2.getValue(), "is not a valid key for the link in the GET-block.");
            }

          // If field not set, return the whole object
          } else {
            // handle success
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

            //Add succesnotification to errorlist
            this._error.addError(["SUCCES", "Het ophalen van informatie is gelukt!", solvefunc, solveparam]);
            Logger.info("GET-request succesful, response:", response);

            //Add whole object to returncomponent
            this._return.setValue(JSON.stringify(response.data));
          }      
        })

        //If error gets thrown
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
          Logger.error("GET-request error:", error);
        });

      //If link is not set
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
        this._error.addError(["ERROR", "De link voor GET is niet gezet.", solvefunc, solveparam]);
        Logger.error("GET-request error: link not set");
      }

      flowcontroller.setAction(null);        
    })});
  }

  private _label: LabelComponent;
  private _label2: LabelComponent;
  private _label3: LabelComponent;
  private _input: InputComponent<string>;
  private _input2: InputComponent<string>;
  private _return: ReturnComponent<string>;
  private _error: ErrorComponent;
}