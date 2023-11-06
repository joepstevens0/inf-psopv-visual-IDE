import Block from "../block";
import BlockClassSaveLoad from '../BlockClassSaveLoad';
import Logger from "@/util/logger";

export type BASEJSON = {name: string, color: string, extradata: any};

export default class BlockComponent {
  public constructor(name: string, color: string, parentBlock : Block) {
    this._name = name;
    this._color = color;
    this._parentBlock = parentBlock;
  }
  public getName(): string {
    return this._name;
  }
  public getColor(): string {
    return this._color;
  }
  public getCompType(): string {
    return "";
  }
  public save(): any {
    return {name: this._name, color: this._color, extradata: ""};
  }
  public load(data: any, parentBlock: Block): BlockComponent {
    const d: BASEJSON = data;
    this._parentBlock = parentBlock;
    this._name = d.name;
    this._color = d.color;

    return this;
  }

  public getParent() : Block{
    return this._parentBlock;
  }
  private _parentBlock: Block;
  private _name: string;
  private _color: string;
}