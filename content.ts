import type { ActionsOptions } from "~types"

const expandAll = () => {
  const allButtons = document.querySelectorAll(
    ".expand-operation"
  ) as NodeListOf<HTMLButtonElement>

  allButtons.forEach((button) => {
    if (button.getAttribute("aria-expanded") === "true") {
      return
    }
    button.click()
  })
}
const compactAll = () => {
  const allButtons = document.querySelectorAll(
    ".expand-operation"
  ) as NodeListOf<HTMLButtonElement>

  allButtons.forEach((button) => {
    if (button.getAttribute("aria-expanded") === "false") {
      return
    }
    button.click()
  })
}

const ACTIONS: Record<ActionsOptions, () => void> = {
  expandAll,
  compactAll
}

chrome.runtime.onMessage.addListener((message: { action: ActionsOptions }) => {
  if (message.action in ACTIONS) {
    ACTIONS[message.action]()
  }
})

export {}
