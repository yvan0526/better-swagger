import {
  Box,
  Button,
  Divider,
  MantineProvider,
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
  const [currentTab, setTab] = useState<TabsOptions>(TabsOptions.PROFILES)
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
      <Box className={classes.popupContainer}>
        <Stack align="center">
          <Title order={3} weight="600">
            Swaggeright
          </Title>
          <Divider my="sm" />
        </Stack>
        {
          isTabSwagger && (
            <Stack>
              <div>
                {NAVIGATION_TABS.map((tab) => (
                  <Button
                    className={classes.tab}
                    key={tab.value}
                    onClick={() => setTab(tab.value)}
                    color="dark"
                    variant={currentTab === tab.value ? "filled" : "default"}
                    name={tab.value}>
                    {tab.label}
                  </Button>
                ))}
              </div>

              <Divider />
              <TabViewer currentTab={currentTab} browserTab={browserTab} />
            </Stack>
          )
        }

        {
          !isTabSwagger && (
            <Text>
              This website is not made with Swagger UI.
            </Text>
          )
        }
      </Box>
    </MantineProvider>
  )
}

export default IndexPopup
