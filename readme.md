# Conditions Builder 

## Tech Stack
 - Typescript v5.x
 - React v18.x
 - Vite 
 - Material UI

 ### Running the project locally

if you're using yarn
 - yarn install
 - yarn dev (starts the project)
 - yarn test - to run unit tests

if you're using npm 
- npm install
- npm run dev (starts the project)
- npm run test (to run unit tests)



### Improvements I would make 
- Styling, would use a theme to for consistent colors, fonts etc
- Error Boundary styling would look better and provide more information as to what went wrong 
- When errors happen, send them to some service that aggregates errors, like honeybadger, sentry etc. 
- Flattening the data structure so you don't have to use complicated nested inefficient loops to filter data 
- Cypress tests, and more unit test coverage
- Fixing the vite build command,  something was up with my typescript config and the build does exit successfully.  

<details>
<summary>Click to expand and see info on the condition builder data structure</summary>

## Conditions Data Structure Explanation

The data structure represents a collection of condition groups, where each group consists of one or more conditions. Here's a breakdown of the structure:

- Each object within the condition groups array represents a condition group and has the following properties:
  - `conditionGroupId`: A unique identifier for the condition group.
  - `ConditionGroupComponent`: A reference to the React component associated with the condition group.
  - `groupPosition`: The position of the condition group within the array.
  - `conditions`: An array of objects representing individual conditions within the group.

- Each condition object within the `conditions` array represents a single condition and has the following properties:
  - `ConditionComponent`: A reference to the React component associated with the condition.
  - `id`: A unique identifier for the condition.
  - `conditionGroupId`: The identifier of the condition group to which the condition belongs.
  - `conditionPosition`: The position of the condition within its parent condition group.
  - `filterOn`: A string specifying the field to be filtered against.
  - `operator`: A string specifying the operator used for the condition such as equals, contains etc
  - `conditionValue`: The value used for comparison in the condition.

This data structure allows you to represent complex conditions by organizing them into condition groups. Each condition group represents an "AND" condition, meaning that all conditions within a group must evaluate to true for the group to be considered true. Within each group, individual conditions represent "OR" conditions, where at least one condition must evaluate to true for the group to be considered true.

## Data Structure

<details>
  <summary>Click to expand and see the shape of the data structure</summary>

```json
[
  {
    "conditionGroupId": "b8a9684f-ef52-457b-aa55-eb7850c72e5c",
    "ConditionGroupComponent": "ConditionsGroupComponent",
    "groupPosition": 0,
    "conditions": [
      {
        "ConditionComponent": "OrConditionComponent",
        "id": "8f2c055d-7359-4b71-8100-ee470d0104aa",
        "conditionGroupId": "b8a9684f-ef52-457b-aa55-eb7850c72e5c",
        "conditionPosition": 0,
        "filterOn": "name",
        "operator": "Contain",
        "conditionValue": "a"
      },
      {
        "ConditionComponent": "OrConditionComponent",
        "id": "5c280a11-7248-4b9d-b4a3-7925f5d85c32",
        "conditionGroupId": "b8a9684f-ef52-457b-aa55-eb7850c72e5c",
        "conditionPosition": 1,
        "filterOn": "id",
        "operator": "Not_Contain",
        "conditionValue": "50000"
      }
    ]
  },
  {
    "conditionGroupId": "a4ee42c4-cc03-442a-a175-f7626f7fa17d",
    "ConditionGroupComponent": "ConditionsGroupComponent",
    "groupPosition": 1,
    "conditions": [
      {
        "ConditionComponent": "OrConditionComponent",
        "id": "99d552be-df42-49cf-b087-89d5dee22455",
        "conditionGroupId": "a4ee42c4-cc03-442a-a175-f7626f7fa17d",
        "conditionPosition": 0,
        "filterOn": "recclass",
        "operator" : "Equals",
        "conditionValue": "L5"
      },
    ],
  }
]
```

</details>
</details>
