import { ElementType } from "react";
import { ConditionGroup } from "./ConditionGroup";
import { ConditionOperatorType } from "@Shared";

export type ConditionsOrObjectType = {
    Component: ElementType;
    id: string;
    groupId: string;
    conditionPosition: number;
    filterOn: LeftConditionOptionsType;
    operator: ConditionOperatorType;
    conditionValue: string;
};

export type GlobalConditionGroupData = {
    groupId: string;
    groupPosition: number;
    conditions: Array<ConditionsOrObjectType>;
    Component: typeof ConditionGroup;
};


export type LeftConditionOptionsType = {
    label: string;
    value: string;
}

export type OperatorType = {
    label: string;
    value: string;
};

export type ConditionGroupProps = {
    groupId: string;
    conditions: Array<ConditionsOrObjectType>;
    updateConditionsArray: UpdateConditionsArrayFunc;
    position: number;
    addCondition: AddConditionFunc;
};

export type UpdateConditionsArrayFunc = (arg: {
    blockId: string;
    conditionArr: Array<ConditionsOrObjectType>;
}) => void;


export type AddConditionFunc = (arg: { groupId: string, leftConditionOptions: Array<LeftConditionOptionsType> }) => void;

export type generateDefaultConditionObjectFunc = (pos: number, leftConditionOptions: Array<LeftConditionOptionsType>, conditionOptions: Array<ConditionOperatorType>, groupID: string) => ConditionsOrObjectType;
