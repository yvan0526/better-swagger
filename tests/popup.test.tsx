import { describe, expect, it } from "@jest/globals"
import { fireEvent, render } from "@testing-library/react"
import React from "react"

import IndexPopup from "~popup"

describe("Popup", () => {
  it("should render", () => {
    const { getByText } = render(<IndexPopup />)
    expect(getByText(/Swaggeright/i)).toBeTruthy()
  })

  it("should switch currentTab state", () => {
    const { getByRole, getByTestId } = render(<IndexPopup />)
    const button = getByRole("button", { name: /Auth/i })
    fireEvent.click(button)

    expect(getByTestId("authContainer")).toBeTruthy()
  })
})
