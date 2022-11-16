import { Button, Group } from "@mantine/core"

import { ActionsOptions } from "~types"

import type { TabViewerProps } from "./TabViewer.types"

const TabViewer = ({ currentTab }: TabViewerProps) => {
  const onActionClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const { name } = e.currentTarget

    const [currentTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    })

    switch (name) {
      case ActionsOptions.EXPAND_ALL:
        await chrome.tabs.sendMessage(currentTab.id, {
          action: ActionsOptions.EXPAND_ALL
        })
        break
      case ActionsOptions.COMPACT_ALL:
        await chrome.tabs.sendMessage(currentTab.id, {
          action: ActionsOptions.COMPACT_ALL
        })
        break
    }
  }

  if (currentTab === "tools") {
    return (
      <Group>
        <Button
          compact
          name={ActionsOptions.EXPAND_ALL}
          onClick={onActionClick}>
          Expand all
        </Button>
        <Button
          compact
          name={ActionsOptions.COMPACT_ALL}
          onClick={onActionClick}>
          Collapse all
        </Button>
      </Group>
    )
  }

  if (currentTab === "auth") {
    return (
      <div data-testid="authContainer">
        <h1>Auth</h1>
      </div>
    )
  }

  return (
    <div>
      <h1>About</h1>
    </div>
  )
}

export default TabViewer
