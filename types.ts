export enum TabsOptions {
  TOOLS = "tools",
  AUTH = "auth",
  ABOUT = "about"
}

export type Tab = {
  label: string
  value: TabsOptions
}
