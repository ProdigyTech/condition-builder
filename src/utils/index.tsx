import { ConditionRow, ConditionGroup } from "@Components";
import { ConditionOptions } from "@Shared";
import { v4 as uuid } from "uuid";
import {
  LeftConditionOptionsType,
  ConditionsOrObjectType,
} from "Components/Conditions/types";



export const generateNewConditionGroup = (
  pos: number,
  leftConditionOptions: Array<LeftConditionOptionsType>,
) => {
  const newGroupId = uuid();
  return {
    groupId: newGroupId,
    groupPosition: pos,
    conditions: [
      generateConditionOrObject(
        0,
        leftConditionOptions,
        newGroupId
      ),
    ],
    Component: ConditionGroup,
  };
};

export const generateConditionOrObject = (
  pos: number,
  leftConditionOptions: Array<LeftConditionOptionsType>,
  groupId: string
) => {
  const result: ConditionsOrObjectType = {
    Component: ConditionRow,
    id: uuid(),
    groupId,
    conditionPosition: pos,
    filterOn: leftConditionOptions[0],
    operator: ConditionOptions[0],
    conditionValue: "",
  };
  return result;
};

