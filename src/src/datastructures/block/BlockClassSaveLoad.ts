
import Block from "./block";
import ProjectVars from '../project/projectvars';
import ProjectImgs from '../project/projectimgs';
import { LabelComponent } from './blockcomponents/labelcomponent';
import { VarBlock, VarSetBlock, ImageMoveUpBlock, ImageMoveDownBlock, ImageMoveLeftBlock, ImageMoveRightBlock, ImageRotateBlock, ImageScaleUpBlock, ImageScaleDownBlock, ImageClickBlock } from '../blocks/blockclasses';
import * as blockclass from "../blocks/blockclasses";

type CLASSJSON = {classname: string, classdata: string};


export default class BlockClassSaveLoad{
    /**
     * save a block in JSON format
     * @param block saving
     * @returns block in JSON format
     */
    public static saveBlock(block: Block): any{
        return {classname: block.constructor.name,classdata: block.save()};
    }

    /**
     * load a block from JSON data
     * @param data in JSON format
     * @pre data is created with saveBlock function
     * @returns new created block
     */
    public static loadBlock(data: any): any{
          const d:CLASSJSON = data;
          const b: Block = new (blockclass as any)[d.classname]();

          b.load(d.classdata);
          switch(b.getName()){
              case "VarSet":
                (b as VarSetBlock).setProjectVars(BlockClassSaveLoad.pv);
                break;
              case "Var":
                (b as VarBlock).setVarName((b.getComponent("Label") as LabelComponent).getText());
                (b as VarBlock).setProjectVars(BlockClassSaveLoad.pv);
                break;
              case "ImageMoveUpBlock":
              (b as ImageMoveUpBlock).setProjectImgs(BlockClassSaveLoad.pi);
              break;
              case "ImageMoveDownBlock":
              (b as ImageMoveDownBlock).setProjectImgs(BlockClassSaveLoad.pi);
              break;
              case "ImageMoveLeftBlock":
              (b as ImageMoveLeftBlock).setProjectImgs(BlockClassSaveLoad.pi);
              break;
              case "ImageMoveRightBlock":
              (b as ImageMoveRightBlock).setProjectImgs(BlockClassSaveLoad.pi);
              break;
              case "ImageRotateBlock":
              (b as ImageRotateBlock).setProjectImgs(BlockClassSaveLoad.pi);
              break;
              case "ImageScaleUpBlock":
              (b as ImageScaleUpBlock).setProjectImgs(BlockClassSaveLoad.pi);
              break;
              case "ImageScaleDownBlock":
              (b as ImageScaleDownBlock).setProjectImgs(BlockClassSaveLoad.pi);
              break;
              case "ImageClickBlock":
              (b as ImageClickBlock).setProjectImgs(BlockClassSaveLoad.pi);
              break;
            }
            return b;
    }

    public static setProjectVars(projectvars: ProjectVars){
         BlockClassSaveLoad.pv = projectvars;
    }

    public static setProjectImg(projectimg: ProjectImgs){
        BlockClassSaveLoad.pi = projectimg;
   }

    private static pv: ProjectVars;
    private static pi: ProjectImgs;
}