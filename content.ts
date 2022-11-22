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
  return !!swaggerElement
}

const signIn = (token: string) => {
  alert(token)
  const authBtn = document.querySelector("#swagger-ui > section > div.swagger-ui > div:nth-child(2) > div.scheme-container > section > div.auth-wrapper > button") as HTMLButtonElement
  authBtn.click()
}

chrome.runtime.onMessage.addListener((message: { action: ActionsOptions, payload?: any }, _, sendResponse) => {

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
    case ActionsOptions.SIGN_IN:
      signIn(message.payload as string)
      break
  }

})

export { }
