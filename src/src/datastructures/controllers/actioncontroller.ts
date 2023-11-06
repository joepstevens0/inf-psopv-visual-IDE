import DragController from './dragcontroller';
import Logger from '@/util/logger';


export default class ActionController {

    /**
     * Undo the most recent added action
     */
    public onUndo() {
        const f = this._undostack.pop();
        const length = this._undostack.length;
        const redostack = this._redostack;

        // undo action
        if (f != undefined) {
            f.action.apply(f.thisArg, f.args);
            Logger.debug("ActionController |","Action undone with function:", f.action);
        }

        // remove the undo actions undo and add it to redo
        if (length < this._undostack.length) {
            redostack.push(this._undostack.pop() as {action: Function, thisArg: any, args: any[]});
            this._redostack = redostack;
        }
    }

    /**
     * Redo the most recent undo
     */
    public onRedo() {
        const f = this._redostack.pop();
        const stack = this._redostack;

        // redo action
        if (f != undefined){
            f.action.apply(f.thisArg, f.args);
            Logger.debug("ActionController |","Action redone with function:", f.action);
        }

        // concat old redo stack to new
        this._redostack = stack.concat(this._redostack);
    }

    /**
     * Add an action to the undostack
     * @param action function called on undo
     * @param thisArg Object used as the this argument for the action
     * @param arglist arguments of the action function
     */
    public addToUndoStack(action: Function, thisArg: any, arglist: any) {
        this._undostack.push({action: action, thisArg: thisArg, args: arglist});
        this._redostack = [];
    }

    private _undostack: {action: Function, thisArg: any, args: any[]}[] = [];
    private _redostack: {action: Function, thisArg: any, args: any[]}[] = [];
};