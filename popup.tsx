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
import { useEffect, useState } from "react"

import TabViewer from "~components/TabViewer/TabViewer"
import { useStyles } from "~styles/global.styles"
import { ActionsOptions, ExtensionStore, TabsOptions } from "~types"
import { NAVIGATION_TABS } from "~utils"

function IndexPopup() {
  const [browserTab, setBrowserTab] = useState<chrome.tabs.Tab>()
  const [currentTab, setTab] = useState<TabsOptions>(TabsOptions.TOOLS)
  const [isTabSwagger, setTabSwagger] = useState(false)
  const { classes } = useStyles()

  // React hook => Fonction intégrée à React qui exécute un bloc d'instructions logique une fois
  useEffect(() => {
    const startExtension = async () => {
      const [currentBrowserTab] = await chrome.tabs.query({ active: true, currentWindow: true })
      setBrowserTab(currentBrowserTab)

      let message = {
        action: ActionsOptions.CHECK_SWAGGER
      }
      const isBrowserTabSwagger = await chrome.tabs.sendMessage(currentBrowserTab.id, message) as boolean
      setTabSwagger(isBrowserTabSwagger)

      const store = JSON.parse(localStorage.getItem("store")) as ExtensionStore ?? {}
      const domainUrl = currentBrowserTab.url.replace("/index.html", '')

      if (!!store[domainUrl]) {
        store[domainUrl] = {
          profiles: [...store[domainUrl].profiles]
        }
      } else {
        store[domainUrl] = {
          profiles: []
        }
      }

      if (isBrowserTabSwagger) {
        localStorage.setItem("store", JSON.stringify(store ?? []))
      }
    }

    startExtension()
  }, [])

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      {
        !isTabSwagger && (
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

            <Text>
              This website is not made with Swagger UI.
            </Text>
          </Box>
        )
      }

      {
        isTabSwagger && (
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
            <TabViewer currentTab={currentTab} browserTab={browserTab} />
          </Box>
        )
      }

    </MantineProvider>
  )
}

export default IndexPopup
