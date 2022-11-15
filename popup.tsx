import { Box, MantineProvider, Title } from "@mantine/core"
import { useState } from "react"

function IndexPopup() {
  const [data, setData] = useState("")

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Box>
        <Title>Popup</Title>
      </Box>
    </MantineProvider>
  )
}

export default IndexPopup
