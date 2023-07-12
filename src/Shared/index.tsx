

export const ConditionOptions: Array<ConditionOperatorType> = [
  {
    label: "Equals",
    value: "1",
  },
  {
    label: "Greater than",
    value: "2",
  },
  {
    label: "Less than",
    value: "3",
  },
  {
    label: "Contain",
    value: "4",
  },
  {
    label: "Not Contain",
    value: "5",
  },
  {
    label: "Regex",
    value: "6",
  },
];

 export type ConditionOperatorType = {
  value: string
  label: string
}