import {  ReactElement } from "react";
import { ConditionGroup } from "./ConditionGroup";

export type ConditionsObject = {
    Component: ReactElement;
    id: string;
    groupId: string;
    position: number;
    filterOn: string;
    operator: string;
    conditionValue: string;
};

export type GlobalConditionGroupData = {
    groupId: string;
    position: number;
    conditions: Array<ConditionsObject>;
    Component: typeof ConditionGroup;
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
    groupId: string;
    position: number;
    filterOn: filterOnType;
    operator: operatorType;
    conditionValue: string;
};

export type ConditionGroupProps = {
    groupId: string;
    conditions: Array<ConditionsObject>;
    updateConditionsArray: UpdateConditionsArrayFunc;
    position: number;
    addCondition: AddConditionFunc;
};

export type UpdateConditionsArrayFunc = (arg: {
    blockId: string;
    conditionArr: Array<ConditionsObject>;
}) => void;


export type AddConditionFunc = (arg: { groupId: string }) => void;
