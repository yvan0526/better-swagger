import type { Profile, TabsOptions } from "~types"

export type TabViewerProps = {
  currentTab: TabsOptions
  browserTab?: chrome.tabs.Tab
}
