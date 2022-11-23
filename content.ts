import { ActionsOptions } from "~types"
import { wait } from "~utils"

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



const signIn = async (token: string) => {
  const authBtn = document.querySelector("#swagger-ui > section > div.swagger-ui > div:nth-child(2) > div.scheme-container > section > div.auth-wrapper > button") as HTMLButtonElement
  authBtn.click()

  try {
    const tokenInput = document.querySelector('[aria-label="auth-bearer-value"]') as HTMLInputElement

    const inputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    inputValueSetter.call(tokenInput, token);

    var event = new Event('input', { bubbles: true });
    tokenInput.dispatchEvent(event);

    const sendTokenBtn = document.querySelector('.auth-btn-wrapper > button[type="submit"]') as HTMLButtonElement
    sendTokenBtn.click()
  }
  finally {
    await wait(100)
    const closeBtn = document.querySelector('.auth-btn-wrapper').lastChild as HTMLButtonElement

    closeBtn.click()
  }
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
