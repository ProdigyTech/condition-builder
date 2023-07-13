# Conditions Builder

A powerful condition builder for filtering data using complex conditions. This project utilizes a tech stack consisting of Typescript, React, Vite, Material UI, React Testing Library, jsdom, and Jest.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Improvements](#improvements)
- [Data Structure](#data-structure)

## Tech Stack

- Typescript v5.x
- React v18.x
- Vite
- Material UI
- React Testing Library, jsdom, jest

## Getting Started

Follow these instructions to run the project locally:

### Prerequisites

- Node.js (v16 or higher)
- npm or Yarn

### Installation

1. Clone the repository.
2. Navigate to the project directory.

If you're using Yarn:

```shell
yarn install
```

If you're using npm:

```shell
npm install
```

### Running the Project

If you're using Yarn:

```shell
yarn dev
```

If you're using npm:

```shell
npm run dev
```

### Running Unit Tests

If you're using Yarn:

```shell
yarn test
```

If you're using npm:

```shell
npm run test
```

## Improvements

Before pushing a build to production, I would make the following improvements:

- Enhance styling for consistent colors, fonts, margins, padding, and overall theme.
- Improve Error Boundary styling and provide more detailed error information.
- Implement error tracking by sending errors to an error aggregation service like Honeybadger or Sentry.
- Flatten the condition data structure to simplify data filtering and improve performance.
- Increase unit test coverage and fix unit test snapshots by addressing CSS class name generation.
- Add end-to-end (E2E) tests using Cypress for comprehensive testing.
- Address the bug or disable the delete button when only one condition exists and you try to delete it. The condition is technically deleted but a new condition is generated due to a useEffect. ConditionBuilder.tsx - line 50 useEffect
- Fix the Vite build command by checking the TypeScript configuration, right now the build command doesn't execute successfully due to some config issues.
- Review TypeScript types and ensure correct setup, considering assistance from experienced TypeScript developers if needed.

## Data Structure

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
  - `operator`: A string specifying the operator used for the condition, such as equals, contains, etc.
  - `conditionValue`: The value used for comparison in the condition.

This data structure allows you to represent complex conditions by organizing them into condition groups. Each condition group represents an "AND" condition, meaning that all top-level conditions must evaluate to true for the group to be considered true. Within each group, individual conditions represent "OR" conditions, where at least one condition must evaluate to true for that particular group to be considered true.

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
