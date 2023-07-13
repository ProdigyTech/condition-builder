import React from "react";
import App from "../App";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

it("it should show error state on invalid URL", async () => {
  const { container } = render(<App />);

  const input = screen.getByRole("textbox");

  await user.type(input, "blahblahblah");
  await user.tab(input);

  await screen.findByText(/invalid url: /i);
});

it("it should show error state on invalid data", async () => {
  render(<App />);

  const input = screen.getByRole("textbox");

  await user.type(input, "http://www.google.com");
  await user.tab(input);

  await screen.findByText(/error occurred /i);
});
