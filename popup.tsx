import {
  Box,
  Button,
  Divider,
  Group,
  MantineProvider,
  Space,
  Stack,
  Text,
  Title
} from "@mantine/core"
import { useState } from "react"

import TabViewer from "~components/TabViewer/TabViewer"
import { useStyles } from "~styles/global.styles"
import { TabsOptions } from "~types"
import { NAVIGATION_TABS } from "~utils"

function IndexPopup() {
  const [currentTab, setTab] = useState<TabsOptions>(TabsOptions.TOOLS)

  const { classes } = useStyles()

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Box className={classes.popupContainer}>
        <Stack align="center">
          <Title order={5} weight="600">
            Swaggeright
          </Title>
          <Text size="sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius, cum
            quidem quos necessitatibus voluptatum reiciendis minima.
          </Text>
          <Divider my="sm" />
        </Stack>
        <Group spacing="lg">
          {NAVIGATION_TABS.map((tab) => (
            <Button
              key={tab.value}
              onClick={() => setTab(tab.value)}
              color="dark"
              variant={currentTab === tab.value ? "filled" : "default"}
              name={tab.value}>
              {tab.label}
            </Button>
          ))}
        </Group>

        <Space h="lg" />
        <TabViewer currentTab={currentTab} />
      </Box>
    </MantineProvider>
  )
}

export default IndexPopup
