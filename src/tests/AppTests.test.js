import React from "react";
import App from "../App";
import {
  fireEvent,
  getAllByLabelText,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import testData from "./data";

const user = userEvent.setup();
jest.mock("axios");

it("it should render a grid with valid data", async () => {
  // mocking axios call so we don't make a web call
  axios.get.mockImplementation(() => Promise.resolve({ data: testData }));
  const { container } = render(<App />);
  // the main url input box
  const input = screen.getByRole("textbox");
  await user.type(input, "http://www.google.com");
  // trigger the blur event
  await user.tab(input);

  // making sure we find a piece of data
  await screen.findByText("Aachen");

  expect(container).toMatchSnapshot();
});

it("it should allow me to apply conditions", async () => {
  // mocking axios call so we don't make a web call
  axios.get.mockImplementation(() => Promise.resolve({ data: testData }));
  const { container } = render(<App />);

  // the main url input box
  const input = screen.getByRole("textbox");

  await user.type(input, "http://www.google.com");

  // trigger the blur event i.e validation
  await user.tab(input);

  const conditionInput = screen.getAllByRole("textbox")[1];

  // using the default filters, we type in the value input box
  await user.type(conditionInput, "Aachen");
  const rows = screen.getAllByRole("row");

  // rows here would have length 2, the headers, + the result.
  expect(rows).toHaveLength(2);

  expect(container).toMatchSnapshot();
});

it("it should allow me to apply an OR condition and filter the results", async () => {
  axios.get.mockImplementation(() => Promise.resolve({ data: testData }));
  const { container } = render(<App />);
  const input = screen.getByRole("textbox");
  await user.type(input, "http://www.google.com");
  await user.tab(input);

  // grabbing the condition input
  const conditionInput = screen.getAllByRole("textbox")[1];

  // searching from aachen with using defaults filterOn options and equals operator
  await user.type(conditionInput, "Aachen");

  // click on the add or button
  const addOrCondition = screen.getByTitle("Add Or");

  // click on the add or button
  await user.click(addOrCondition);

  // when a new and filter is added, we have all the rows until a valid condition is formed
  screen.getByText(/Filtered: 1000/i);
  expect(container).toMatchSnapshot();

  // grabbing the second conditions or input
  const conditionInput2 = screen.getAllByRole("textbox")[2];
  await user.type(conditionInput2, "Agen");
  // making sure we have the correct filtered results
  screen.getByText(/Filtered: 2/i);
  screen.getByText(/Total: 1000/i);

  expect(container).toMatchSnapshot();
});

it("it should allow me to apply an AND condition and filter the results", async () => {
  axios.get.mockImplementation(() => Promise.resolve({ data: testData }));
  const { container } = render(<App />);
  const input = screen.getByRole("textbox");
  await user.type(input, "http://www.google.com");
  await user.tab(input);

  // grabbing the condition input
  const conditionInput = screen.getAllByRole("textbox")[1];

  // searching from aachen with using defaults filterOn options and equals operator
  await user.type(conditionInput, "Aachen");

  // click on the add or button
  const addAndCondition = screen.getByTitle("AND");

  // click on the add or button
  await user.click(addAndCondition);

  // when a new and filter is added, we have all the rows until a valid condition is formed
  screen.getByText(/Filtered: 1/i);

  // grabbing the second input from the AND condition
  const conditionInput2 = screen.getAllByRole("textbox")[2];
  await user.type(conditionInput2, "Agen");

  // making sure we have the correct filtered results, no results should exist
  screen.getByText(/Filtered: 0/i);
  screen.getByText(/Total: 1000/i);

  // here we're changing the dropdown the operation to use 'contain'

  const operationsDropdownFirst = screen.getAllByRole("button", {
    name: /Equals/i,
  })[0];

  await user.click(operationsDropdownFirst);
  const operationsDropdownFirstOption = screen.getAllByRole("option", {
    name: /Contain/i,
  })[0];

  await user.click(operationsDropdownFirstOption);

  // here we're interacting with the second group of dropdowns

  const leftConditionDropdown = screen.getAllByRole("button", {
    name: /name/i,
  })[1];

  await user.click(leftConditionDropdown);

  const leftConditionDropdownOption = screen.getAllByRole("option", {
    name: /id/i,
  })[1];

  await user.click(leftConditionDropdownOption);
  

  const operationsDropdownSecond = screen.getAllByRole("button", {
    name: /Equals/i,
  })[1];

  await user.click(operationsDropdownSecond);

  const operatorDropdownOption = screen.getAllByRole("option", {
    name: /Greater Than/i,
  })[1];

  await user.click(operatorDropdownOption);

  await user.type(conditionInput, "a");

  await user.type(conditionInput2, "5000");

  screen.getByText(/Filtered: 602/i);

  expect(container).toMatchSnapshot();
});
