

export type ConditionOperatorType = {
  value: ConditionOperator;
  label: string;
};

export enum ConditionOperator {
  "Equals" = "Equals",
  "Greater_Than" = "Greater_Than",
  "Less_Than" = "Less_Than",
  "Contain" = "Contain",
  "Not_Contain" = "Not_Contain",
  "Regex" = "Regex",
}

export const ConditionOperators: Array<ConditionOperatorType> = [
  {
    label: "Equals",
    value: ConditionOperator.Equals,
  },
  {
    label: "Greater Than",
    value: ConditionOperator.Greater_Than,
  },
  {
    label: "Less Than",
    value: ConditionOperator.Less_Than,
  },
  {
    label: "Contain",
    value: ConditionOperator.Contain,
  },
  {
    label: "Not Contain",
    value: ConditionOperator.Not_Contain,
  },
  {
    label: "Regex",
    value: ConditionOperator.Regex,
  },
];
export const OperatorsToTriggerNumberValidation: Array<ConditionOperator> = [
  ConditionOperator.Greater_Than,
  ConditionOperator.Less_Than,
];
