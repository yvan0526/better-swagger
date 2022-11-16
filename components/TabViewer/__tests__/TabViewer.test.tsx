import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest
} from "@jest/globals"
import { act, render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { chrome as chromeMock } from "jest-chrome"

import TabViewer from "~components/TabViewer/TabViewer"

describe("TabViewer", () => {
  it("should render the correct tab", () => {
    const { getByText } = render(<TabViewer currentTab="about" />)
    expect(getByText(/About/i)).toBeTruthy()
  })
})
