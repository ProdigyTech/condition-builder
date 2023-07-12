import { ElementType } from "react";
import { ConditionGroup } from "./ConditionGroup";
import { ConditionOperatorType } from "./shared/index";

export type ConditionsOrObjectType = {
    Component: ElementType;
    id: string;
    groupId: string;
    conditionPosition: number;
    filterOn: string;
    operator: string;
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
    updateConditionsByGroupId: UpdateConditionsArrayByGroupIdFunc;
    groupPosition: number;
    addCondition: AddConditionFunc;
    leftConditionOptions: Array<LeftConditionOptionsType>;
};

export type UpdateConditionsArrayByGroupIdFunc = (arg: {
    groupId: string;
    updatedConditions: Array<ConditionsOrObjectType>;
}) => void;


export type AddConditionFunc = (arg: { groupId: string, leftConditionOptions: Array<LeftConditionOptionsType> }) => void;

export type generateDefaultConditionObjectFunc = (pos: number, leftConditionOptions: Array<LeftConditionOptionsType>, ConditionOperators: Array<ConditionOperatorType>, groupID: string) => ConditionsOrObjectType;
