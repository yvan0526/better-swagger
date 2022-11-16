import { ActionsOptions } from "~types"

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

const checkSwagger = () => {
  const swaggerElement = document.getElementById("swagger-ui")
  console.log({
    swaggerElement
  })
  return !!swaggerElement
}



chrome.runtime.onMessage.addListener((message: { action: ActionsOptions }, _, sendResponse) => {

  switch (message.action) {
    case ActionsOptions.EXPAND_ALL:
      expandAll();
      break
    case ActionsOptions.COMPACT_ALL:
      compactAll();
      break
    case ActionsOptions.CHECK_SWAGGER:
      const isSwagger = checkSwagger()
      sendResponse(isSwagger)
      break
  }

})

export { }
