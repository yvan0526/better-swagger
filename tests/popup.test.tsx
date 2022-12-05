import { describe, expect, it } from "@jest/globals"
import { fireEvent, render } from "@testing-library/react"
import React from "react"

import IndexPopup from "~popup"

describe("Popup", () => {
  try {
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
  }
  catch (error) {
    const _error: Error = error
    console.log(_error.name + ' in describe(string, function) in popup.test.tsx: \n\t' + _error.message)
  }
})
