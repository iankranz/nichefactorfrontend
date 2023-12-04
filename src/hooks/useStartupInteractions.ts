import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { StartupLocalState } from "../types"
import { useEffect, useState } from "react"

export default function useStartupInteractions(startupId: string | undefined) {
  const queryClient = useQueryClient()
  const [startupLocalState, setStartupLocalState] =
    useState<StartupLocalState | null>(null)

  const addFireMutation = useMutation({
    mutationFn: () => {
      return fetch(
        `https://api.startupnichefactor.com/startups/${
          startupId ?? "unknown"
        }/add-fire`
      )
    },
  })
  const removeFireMutation = useMutation({
    mutationFn: () => {
      return fetch(
        `https://api.startupnichefactor.com/startups/${
          startupId ?? "unknown"
        }/remove-fire`
      )
    },
  })
  const addSnoozeMutation = useMutation({
    mutationFn: () => {
      return fetch(
        `https://api.startupnichefactor.com/startups/${
          startupId ?? "unknown"
        }/add-snooze`
      )
    },
  })
  const removeSnoozeMutation = useMutation({
    mutationFn: () => {
      return fetch(
        `https://api.startupnichefactor.com/startups/${
          startupId ?? "unknown"
        }/remove-snooze`
      )
    },
  })

  useEffect(() => {
    const lsString = localStorage.getItem(startupId ?? "unknown")
    if (lsString) {
      const ls = JSON.parse(lsString)
      setStartupLocalState(ls)
    }
  }, [startupId])

  async function handleFireClick() {
    await addFireMutation.mutate()
    if (startupLocalState && startupLocalState.snooze) {
      await removeSnoozeMutation.mutate()
    }
    setStartupLocalState({ fire: true, snooze: false })
    localStorage.setItem(
      startupId ?? "unknown",
      JSON.stringify({ fire: true, snooze: false })
    )
    queryClient.invalidateQueries({
      queryKey: [`startup-${startupId ?? "unknown"}`],
    })
  }

  async function handleSnoozeClick() {
    await addSnoozeMutation.mutate()
    if (startupLocalState && startupLocalState.fire) {
      await removeFireMutation.mutate()
    }
    setStartupLocalState({ fire: false, snooze: true })
    localStorage.setItem(
      startupId ?? "unknown",
      JSON.stringify({ fire: false, snooze: true })
    )
    queryClient.invalidateQueries({
      queryKey: [`startup-${startupId ?? "unknown"}`],
    })
  }

  return {
    startupLocalState,
    handleFireClick,
    handleSnoozeClick,
  }
}
