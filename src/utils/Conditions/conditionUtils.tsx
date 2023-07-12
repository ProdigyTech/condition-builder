import { ConditionGroup, ConditionRow } from "@Components";
import { ReactElement } from "react";

type ConditionsObject = {
  Component: ReactElement;
  id: string;
  blockId: string;
  position: number;
  filterOn: string;
  operator: string;
  conditionValue: string;
};

type GlobalConditionGroupData = {
  blockId: string;
  position: number;
  conditions: Array<ConditionsObject>;
  Component: typeof ConditionGroup;
};

type filterOnType = {
  label: string;
  value: string;
};

type operatorType = {
  label: string;
  value: string;
};

type DefaultConditionObjectType = {
  Component: ReactElement;
  id: string;
  blockId: string;
  position: number;
  filterOn: filterOnType;
  operator: operatorType;
  conditionValue: string;
};

export const generateDefaultConditionObject = (
  pos: number,
  leftConditionOptions: Array<operatorType>,
  ConditionOptions: Array<operatorType>,
  blockId: string
) => {
  const result: DefaultConditionObjectType = {
    Component: ConditionRow,
    id: uuidv4(),
    blockId: blockId,
    position: pos,
    filterOn: leftConditionOptions[0],
    operator: ConditionOptions[0],
    conditionValue: "",
  };

  return result;
};
