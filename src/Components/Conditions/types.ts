import {  ReactElement } from "react";
import { ConditionBlock } from "./ConditionBlock";

export type ConditionsObject = {
    Component: ReactElement;
    id: string;
    blockId: string;
    position: number;
    filterOn: string;
    operator: string;
    conditionValue: string;
};

export type GlobalConditionBlockData = {
    blockId: string;
    position: number;
    conditions: Array<ConditionsObject>;
    Component: typeof ConditionBlock;
};

export type filterOnType = {
    label: string;
    value: string;
};

export type operatorType = {
    label: string;
    value: string;
};

export type DefaultConditionObjectType = {
    Component: ReactElement;
    id: string;
    blockId: string;
    position: number;
    filterOn: filterOnType;
    operator: operatorType;
    conditionValue: string;
};

export type ConditionBlockProps = {
    blockId: string;
    conditions: Array<ConditionsObject>;
    updateConditionsArray: UpdateConditionsArrayFunc;
    position: number;
    addCondition: AddConditionFunc;
};

export type UpdateConditionsArrayFunc = (arg: {
    blockId: string;
    conditionArr: Array<ConditionsObject>;
}) => void;


export type AddConditionFunc = (arg: { blockId: string }) => void;
