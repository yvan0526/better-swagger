import { Tab, TabsOptions } from "~types"

export const NAVIGATION_TABS: Tab[] = [
  {
    label: "Profiles",
    value: TabsOptions.PROFILES
  },
  {
    label: "Auth",
    value: TabsOptions.AUTH
  },
  {
    label: "Tools",
    value: TabsOptions.TOOLS
  },
  {
    label: "About",
    value: TabsOptions.ABOUT
  }
]

export const wait = (ms: number) => new Promise((res) => setTimeout(res, ms))
