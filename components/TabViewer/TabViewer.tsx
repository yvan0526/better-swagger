import { Button, Card, Divider, Group, PasswordInput, Space, Stack, Text, TextInput } from "@mantine/core"
import { useForm } from "react-hook-form"

import _ from 'lodash'
import { ActionsOptions, AuthResponseDto, ExtensionStore, Profile, TabsOptions } from "~types"

import type { TabViewerProps } from "./TabViewer.types"
import axios from "axios"

const TabViewer = ({ currentTab, browserTab }: TabViewerProps) => {
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
    let data = undefined
    await axios.post(profile.authRoute, {
      email: profile.email,
      password: profile.password
    })
      .then((response) => {
        data = response
      })
      .catch((error) => {
        alert(`Error while connecting as ${profile.name} : ${error}`)
      })

    if (data === undefined) {
      return
    }

    const { access_token } = data as AuthResponseDto

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
      token: access_token
    })
  }

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

    window.location.reload()
  }

  const store = JSON.parse(localStorage.getItem("store")) as ExtensionStore

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
            <Divider />
            <TextInput label="Auth route" placeholder="https://my-domain.com/api/auth" {...form.register('authRoute', { required: true })} />
            <TextInput label="Nom" placeholder="Customer Profile" {...form.register("name", { required: true })} />
            <TextInput label="Email" placeholder="root@root.com" {...form.register("email", { required: true })} />
            <PasswordInput label="Password" placeholder="********" {...form.register("password", { required: true })} />
            <Space />
            <Button onClick={onCreateProfile}>Add</Button>
          </Stack>
        </div>
      )

    case TabsOptions.PROFILES: {
      return (
        <div data-testid="authContainer">
          <Stack>
            {
              Object.entries(store ?? []).map(([key, value]) => {

                const { profiles } = value // Destructurer un objet => value.profiles

                return profiles.map((profile) => (
                  <Card key={profile.id} shadow="sm" p="lg" radius="lg">
                    <Group position="apart">
                      <Text size="sm" color="green">{profile.name}</Text>
                      <Button onClick={() => onProfileUse(profile)}>
                        USE
                      </Button>
                      <Button onClick={() => onProfileDeletion(profile)}>
                        DELETE
                      </Button>
                    </Group>
                  </Card>
                ))
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
        </div>
      )
  }
}

export default TabViewer
