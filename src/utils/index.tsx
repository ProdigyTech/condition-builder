import { ConditionRow, ConditionGroup } from "../components/index";
import { ConditionOperators } from "../components/conditions/shared/index";
import { v4 as uuid } from "uuid";
import {
  LeftConditionOptionsType,
  ConditionsOrObjectType,
} from "../components/conditions/types";


/**
 * 
 *  Shared method that generates a new empty condition group. 
 *  Takes a position and the Left Condition dropdown options
 */
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
  };
};

/**
 * 
 *  Generates an OR condition object. Takes a position, left condition options
 *  and a groupId of the parent conditionGroup of which it belongs. 
 */
export const generateConditionOrObject = (
  pos: number,
  leftConditionOptions: Array<LeftConditionOptionsType>,
  groupId: string
) => {
  const result: ConditionsOrObjectType = {
    id: uuid(),
    groupId,
    conditionPosition: pos,
    filterOn: leftConditionOptions[0].value,
    operator: ConditionOperators[0].value,
    conditionValue: "",
  };
  return result;
};

