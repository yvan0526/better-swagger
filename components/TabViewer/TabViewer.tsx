import { Button, Group } from "@mantine/core"

import type { TabViewerProps } from "./TabViewer.types"

const TabViewer = ({ currentTab }: TabViewerProps) => {
  if (currentTab === "tools") {
    return (
      <Group>
        <Button compact>Expand all</Button>
        <Button compact>Collapse all</Button>
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
