type ConditionsObject = {
  Component: ReactElement;
  id: string;
  blockId: string;
  position: number;
  filterOn: string;
  operator: string;
  conditionValue: string;
};

type GlobalConditionBlockData = {
  blockId: string;
  position: number;
  conditions: Array<ConditionsObject>;
  Component: typeof ConditionBlock;
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
    Component: ConditionDropdown,
    id: uuidv4(),
    blockId: blockId,
    position: pos,
    filterOn: leftConditionOptions[0],
    operator: ConditionOptions[0],
    conditionValue: "",
  };

  return result;
};
