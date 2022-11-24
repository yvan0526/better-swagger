import { Box, Button, Card, Divider, Group, PasswordInput, Space, Stack, Text, TextInput } from "@mantine/core"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useStyles } from "~styles/global.styles"

import _ from 'lodash'
import { ActionsOptions, AuthResponseDto, AuthErrorResponseDto, ExtensionStore, Profile, TabsOptions } from "~types"

import type { TabViewerProps } from "./TabViewer.types"
import axios, { AxiosError } from "axios"

const TabViewer = ({ currentTab, browserTab }: TabViewerProps) => {
  const { classes } = useStyles()

  const form = useForm<Profile>({
    defaultValues: {
      id: _.uniqueId()
    }
  })

  const onCreateProfile = form.handleSubmit(async (data) => {
    if (!browserTab) {
      return
    }

    const oldStore = JSON.parse(localStorage.getItem("store")) as ExtensionStore
    const domainUrl = browserTab.url.replace("/index.html", '')
    let newStore = {} as ExtensionStore

    if (!!oldStore[domainUrl]) {
      newStore = {
        [domainUrl]: {
          profiles: [...oldStore[domainUrl].profiles ?? [], data]
        }
      }
    }
    localStorage.setItem("store", JSON.stringify(newStore))

    form.reset({
      id: _.uniqueId()
    })
  })

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

  const onProfileUse = async (profile: Profile) => {
    // Recuperation du token
    let response = undefined
    await axios.post(profile.authRoute, {
      email: profile.email,
      password: profile.password
    })
      .then((success) => {
        response = success
      })
      .catch((error: AxiosError) => {
        const dataError = error.response.data as AuthErrorResponseDto

        alert(`Error while connecting as ${profile.name} : ${error}\n\n` +
              `Error: ${dataError.Error}\n` +
              `Message: ${dataError.Message}`)
      })

    if (response === undefined) {
      return
    }

    const { access_token } = response.data as AuthResponseDto

    if (access_token === undefined) {
      return
    }

    // Envoie du token dans le contexte de l'onglet
    const [currentTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    })

    chrome.tabs.sendMessage(currentTab.id, {
      action: ActionsOptions.SIGN_IN,
      payload: access_token
    })
  }

  const [stateStore, setStateStore] = useState(JSON.parse(localStorage.getItem("store")) as ExtensionStore)
  const onProfileDeletion = async (profileToDelete: Profile) => {
    const oldStore = JSON.parse(localStorage.getItem("store")) as ExtensionStore
    const domainUrl = browserTab.url.replace("/index.html", '')
    let newStore: ExtensionStore = {}

    const newProfiles = oldStore[domainUrl].profiles.filter((profile) => {
      return profile.id != profileToDelete.id
    })
    newStore[domainUrl] = {
      profiles: newProfiles
    }

    localStorage.setItem("store", JSON.stringify(newStore))
    setStateStore(newStore)
  }

  switch (currentTab) {
    case TabsOptions.TOOLS:
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

    case TabsOptions.AUTH:
      return (
        <div data-testid="authContainer">
          <Stack>
            <TextInput label="Nom" placeholder="Customer Profile" {...form.register("name", { required: true })} />
            <TextInput label="Auth route" placeholder="https://my-domain.com/api/auth" {...form.register('authRoute', { required: true })} />
            <TextInput label="Email" placeholder="root@root.com" {...form.register("email", { required: true })} />
            <PasswordInput label="Password" placeholder="********" {...form.register("password", { required: true })} />
            <Space />
            <Button onClick={onCreateProfile}>Add</Button>
          </Stack>
        </div>
      )

    case TabsOptions.PROFILES: {
      const store = JSON.parse(localStorage.getItem("store")) as ExtensionStore
      const domainUrl = browserTab.url.replace("/index.html", '')
      const domain = store[domainUrl]

      if (!domain) {
        return
      }

      return (
        <div data-testid="authContainer">
          <Stack>
            {
              domain.profiles.map((profile) => {
                return (
                  <Card key={profile.id} shadow="sm" p="sm" radius="lg">
                    <Group position="apart">
                      <Button className={classes.profileButton} w="65%" onClick={() => onProfileUse(profile)}>
                        {profile.name}
                      </Button>
                      <Button className={classes.profileButton} w="20%" onClick={() => onProfileDeletion(profile)} color="red">
                        X
                      </Button>
                    </Group>
                  </Card>
                )
              })
            }
          </Stack>
        </div>
      )
    }

    default:
      return (
        <div>
          <h1>About</h1>
          <p>Swaggeright was made by Adil Basri and Yvan Giordano.</p>
        </div>
      )
  }
}

export default TabViewer
