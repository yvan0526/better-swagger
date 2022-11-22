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
  const authBtn = document.querySelector("#swagger-ui > section > div.swagger-ui > div:nth-child(2) > div.scheme-container > section > div.auth-wrapper > button") as HTMLButtonElement
  authBtn.click()

  const tokenInput = document.querySelector('#swagger-ui > section > div.swagger-ui > div:nth-child(2) > div.scheme-container > section > div.auth-wrapper > div > div.modal-ux > div > div > div.modal-ux-content > div > form > div:nth-child(1) > div:nth-child(3) > section > input[type=text]') as HTMLInputElement
  tokenInput.value = token

  const sendTokenBtn = document.querySelector('#swagger-ui > section > div.swagger-ui > div:nth-child(2) > div.scheme-container > section > div.auth-wrapper > div > div.modal-ux > div > div > div.modal-ux-content > div > form > div.auth-btn-wrapper > button.btn.modal-btn.auth.authorize.button') as HTMLButtonElement
  sendTokenBtn.click()
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
