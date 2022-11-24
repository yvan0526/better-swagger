export enum TabsOptions {
  TOOLS = "tools",
  AUTH = "auth",
  PROFILES = "profiles",
  ABOUT = "about"
}

export type Tab = {
  label: string
  value: TabsOptions
}

export enum ActionsOptions {
  EXPAND_ALL = "expandAll",
  COMPACT_ALL = "compactAll",
  CHECK_SWAGGER = "checkSwagger",
  SIGN_IN = "signIn"
}

export type Profile = {
  id: string,
  authRoute: string
  name: string,
  email: string,
  password: string
}

export type ExtensionStore = Record<string, { profiles: Profile[] }>

export type AuthResponseDto = {
  access_token: string,
}

export type AuthErrorResponseDto = {
  Code: number,
  Complement: string,
  Error: string,
  Message: string
}
