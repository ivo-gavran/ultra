import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

import Home from "@/app/page";

test("renders the user overview heading", () => {
  render(<Home />);

  expect(
    screen.getByRole("heading", {
      level: 1,
      name: /users/i,
    }),
  ).toBeDefined();
});
