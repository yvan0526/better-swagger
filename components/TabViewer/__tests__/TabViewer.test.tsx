import { describe, expect, it } from "@jest/globals"
import { render } from "@testing-library/react"

import TabViewer from "~components/TabViewer/TabViewer"

describe("TabViewer", () => {
  it("should render the correct tab", () => {
    const { getByText } = render(<TabViewer currentTab="about" />)
    expect(getByText(/About/i)).toBeTruthy()
  })
})
