import { StartBlock, KeyStartBlock } from "@/datastructures/blocks/basicblocks/basicblocks";
import { ForBlock, WhileBlock } from "@/datastructures/blocks/loopblocks/loopblocks";
import { IfBlock, IfElseBlock } from "@/datastructures/blocks/testblocks/testblocks";
import { CompareBlock, PlusBlock, MinusBlock, DivideBlock, TimesBlock, GreaterThanBlock, LessThanBlock } from "@/datastructures/blocks/mathblocks/mathblocks";
import { PrintBlock, CommentBlock, LengthBlock, ConcatBlock, IndexBlock, IndexOfBlock, SubstrBlock } from "@/datastructures/blocks/stringblocks/stringblocks";
import { TrueBlock, FalseBlock, VarBlock, VarSetBlock } from "@/datastructures/blocks/valueblocks/valueblocks";
import { ImageMoveUpBlock, ImageMoveDownBlock, ImageMoveLeftBlock, ImageMoveRightBlock, ImageRotateBlock, ImageScaleUpBlock, ImageScaleDownBlock, ImageClickBlock } from "@/datastructures/blocks/imageblocks/imageblocks";
import { ANDBlock, ORBlock, NOTBlock } from "@/datastructures/blocks/logicblocks/logicblocks";
import { FunctionEncloseBlock, FunctionCallBlock } from "@/datastructures/blocks/functionblocks/functionblocks";
import { GETBlock, PUTBlock, POSTBlock, PATCHBlock, DELETEBlock, JSONParamBlock } from "@/datastructures/blocks/apiblocks/apiblocks";

import colors from "@/assets/standardcolors.json";

const basis = "white";
const loops = (colors as any).loopblocks;
const tests = (colors as any).testblocks;
const math = (colors as any).mathblocks;
const strings = (colors as any).stringblocks;
const values = (colors as any).valueblocks;
const images = (colors as any).imageblocks;
const logic = (colors as any).logicblocks;
const functions = (colors as any).functionblocks;
const api = (colors as any).apiblocks;

export const Categories= [
    {
        Name: "Basis",
        Color: basis,
        Blocks: [
            new StartBlock(),
            new KeyStartBlock(),
            new ForBlock(),
            new IfBlock(),
            new PrintBlock(),
            new CompareBlock(),
            new ImageRotateBlock()]
    },
    {
        Name: "Lussen",
        Color: loops,
        Blocks: [
            new ForBlock(),
            new WhileBlock()]
    },
    {
        Name: "Testen",
        Color: tests,
        Blocks: [
            new IfBlock()]
    },
    {
        Name: "Rekenen",
        Color: math,
        Blocks: [
            new CompareBlock(),
            new PlusBlock(),
            new MinusBlock(),
            new TimesBlock(),
            new DivideBlock(),
            new GreaterThanBlock(),
            new LessThanBlock()]
    },
    {
        Name: "Tekst",
        Color: strings,
        Blocks: [
            new PrintBlock(),
            new CommentBlock(),
            new LengthBlock(),
            new ConcatBlock(),
            new IndexBlock(),
            new IndexOfBlock(),
            new SubstrBlock()]
    },
    {
        Name: "Waardes",
        Color: values,
        Blocks: [
            new TrueBlock(),
            new FalseBlock(),
            new VarSetBlock()]
    },
    {
        Name: "Afbeeldingen",
        Color: images,
        Blocks: [
            new ImageClickBlock(),
            new ImageRotateBlock(),
            new ImageMoveUpBlock(),
            new ImageMoveDownBlock(),
            new ImageMoveLeftBlock(),
            new ImageMoveRightBlock(),
            new ImageScaleUpBlock(),
            new ImageScaleDownBlock()]
    },
    {
        Name: "Logica",
        Color: logic,
        Blocks: [
            new ANDBlock(),
            new ORBlock(),
            new NOTBlock()]
    },
    {
        Name: "Functies",
        Color: functions,
        Blocks: [new FunctionEncloseBlock()]
    },
    {
        Name: "API",
        Color: api,
        Blocks: [
            new GETBlock(),
            new POSTBlock(),
            new PUTBlock(),
            new PATCHBlock(),
            new DELETEBlock(),
            new JSONParamBlock()]
    }
];