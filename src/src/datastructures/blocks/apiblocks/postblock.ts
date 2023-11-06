import Block from "../../block/block";
import {
  AttachComponent,
  InputComponent,
  LabelComponent,
  ConnectComponent,
  BreakComponent,
  APIEnclosureComponent,
  ErrorComponent,
} from "../../block/blockcomponents/blockcomponents";
import { FlowController } from '../../controllers/flowcontroller';
import Logger from "@/util/logger";

const axios = require('axios').default;

import colors from "@/assets/standardcolors.json"
import { GhostBlock } from '../basicblocks/basicblocks';
const _color = (colors as any).apiblocks;
import {responselist} from "./responselist";

// POST works (gives correct response)
export class POSTBlock extends Block {
  public constructor() {
    super("POST", _color);
    //Top
    this._connect = new ConnectComponent(this);
    this.addComponent(this._connect);

    //Bottom
    this._enclose = new APIEnclosureComponent(this.getColor(), this);
    this.addComponent(this._enclose);
    this._attach = new AttachComponent(this.getColor(), this);
    this.addComponent(this._attach);

    //Base
    this._label = new LabelComponent(this);
    this._label.setText("Verstuur data (POST)");
    this.addComponent(this._label);

    this.addComponent(new BreakComponent(this));

    this._linklabel = new LabelComponent(this);
    this._linklabel.setText("link");
    this.addComponent(this._linklabel);
    this._linkinput = new InputComponent<string>(this, "string");
    this._linkinput.setDefault(new GhostBlock());
    this.addComponent(this._linkinput);

    this._error = new ErrorComponent(this);
    this.addComponent(this._error);

  }

  public execute(flowcontroller : FlowController): void {
    flowcontroller.setAction(this._linkinput.getBlock(), async () => { 

      //Make JSON object from parameters
      let jsonstring = '{';

      //If parameters are given
      if (this._enclose.getFirstBlock() != null){

        //Loop through parameters to make JSON object
        let b = this._enclose.getFirstBlock();
        b.execute(flowcontroller);
        jsonstring += (b as JSONParamBlock).getString();
        b = (b as JSONParamBlock).getNextParam();
        while ( b != null) {
          jsonstring += ',';
          b.execute(flowcontroller);
          jsonstring += (b as JSONParamBlock).getString();
          b = (b as JSONParamBlock).getNextParam();
        }
      }

      jsonstring += '}';
      const dataobj =JSON.parse(jsonstring);

      //If link is set
      if (this._linkinput.getValue() != undefined){
        //Try to execute request
        await axios.post(this._linkinput.getValue(), dataobj)
        .then((response) => {
          // handle succes

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
          this._error.addError(["SUCCES", "Het verzenden van informatie is gelukt!", solvefunc, solveparam]);
          Logger.info("POST-request succesful, response:", response);
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
          Logger.error("POST-request error:", error);
        });

      //If link is not set
      } else {
        //Handle error

        // error that gets caught: Link not set
        // How to solve: check if there is input.

        // Create function that checks if said error is solved:
        const solveparam = [this._linkinput];
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
        this._error.addError(["ERROR", "De link voor POST is niet gezet.", solvefunc, solveparam]);
        Logger.error("POST-request error: link not set");
      }

      flowcontroller.setAction(this._attach.getNext());  
    });
  }

  private _connect: ConnectComponent;
  private _attach: AttachComponent;
  private _enclose: APIEnclosureComponent;
  private _label: LabelComponent;
  private _linklabel: LabelComponent;
  private _linkinput: InputComponent<string>;
  private _error: ErrorComponent;
}