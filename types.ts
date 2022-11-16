export enum TabsOptions {
  TOOLS = "tools",
  AUTH = "auth",
  ABOUT = "about"
}

export type Tab = {
  label: string
  value: TabsOptions
}

export enum ActionsOptions {
  EXPAND_ALL = "expandAll",
  COMPACT_ALL = "compactAll",
  CHECK_SWAGGER = "checkSwagger"
}
