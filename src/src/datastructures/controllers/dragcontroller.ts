import Block from "../block/block";
import Logger from '@/util/logger';


export default class DragController {

    /**
     * select a block
     * @param block wich will be selected
     * @param offset of selection
     * @post block will be selected with an offset of offset
     */
    public selectBlock(block: Block | null, offset: [number, number] = [0, 0]) {
        Logger.debug("DragController |","Selecting new block:", block, " with offset:", offset);
        this._selected = block;
        this._offset = offset;
    }

    /**
     * @returns current offset of selected block
     */
    public getSelectedOffset(): [number, number] {
        return this._offset;
    }
    /**
     * Change the current offset of selected block
     * @param offset new offset
     */
    public setSelectedOffset(offset: [number, number]) {
        this._offset = offset;
    }
    /**
     * @returns the current selected block
     */
    public getSelectedBlock(): Block | null {
        return this._selected;
    }

    /**
     * Update the current cursor position in the client
     * @param pos new position in client
     */
    public setClientPos(pos: [number, number]) {
        this._clientpos = pos;
    }
    /**
     * @returns last stored cursor position in the client
     */
    public getClientPos(): [number, number] {
        return this._clientpos;
    }

    /**
     * remove the selected block
     * @post no block is selected and offset is (0,0)
     */
    public removeSelectedBlock() {
        Logger.debug("DragController |", "removing selected block");
        this._selected = null;
    }

    private _selected: Block | null = null;
    private _offset: [number, number] = [0, 0];
    private _clientpos: [number, number] = [0, 0];
};