import { useParams } from "react-router-dom"
import PageLayout from "./PageLayout"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { Startup, StartupLocalState } from "./types"
import ExternalWindowIcon from "./ExternalWindowIcon"
import { useEffect, useState } from "react"

function StartupPage() {
  const { startupId } = useParams()
  const queryClient = useQueryClient()
  const [startupLocalState, setStartupLocalState] =
    useState<StartupLocalState | null>(null)

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`startup-${startupId ?? "unknown"}`],
    queryFn: async () => {
      const response = await fetch(
        `https://api.startupnichefactor.com/startups/${startupId ?? "unknown"}`
      )
      return response.json() as Promise<Startup>
    },
  })

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

  if (isPending) {
    return <span>Lodaing...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

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

  return (
    <PageLayout>
      <div className="rounded-xl shadow-sm bg-orange-100 p-4 flex flex-col items-center gap-2 w-full">
        <div className="font-semibold text-6xl">{data.name}</div>
        <div>{data.tagline}</div>
        <div className="flex gap-2">
          <div>🔥{data.fire_score}</div>
          <div>💤{data.snooze_score}</div>
        </div>
      </div>
      <div className="rounded-xl shadow-sm bg-orange-100 p-4 flex flex-col items-center w-full">
        <div className="text-xl font-semibold mb-2">Your vote</div>
        <div className="flex items-center">
          {startupLocalState?.fire ? (
            <div className="text-7xl cursor-default">🔥</div>
          ) : (
            <button
              className="text-7xl cursor-pointer opacity-20"
              onClick={handleFireClick}
            >
              🔥
            </button>
          )}
          <div>or</div>
          {startupLocalState?.snooze ? (
            <div className="text-7xl cursor-default">💤</div>
          ) : (
            <button
              className="text-7xl cursor-pointer opacity-20"
              onClick={handleSnoozeClick}
            >
              💤
            </button>
          )}
        </div>
      </div>
      <div className="rounded-xl shadow-sm bg-orange-100 p-4 w-full">
        <div className="font-semibold text-2xl mb-2">Summary</div>
        <p>{data.summary}</p>
      </div>
      <div className="rounded-xl shadow-sm bg-orange-100 p-4 w-full mb-12">
        <div className="font-semibold text-2xl mb-2">Links</div>
        <div className="flex gap-8">
          <a
            className="basis-1/2 text-orange-600 underline cursor-pointer flex items-center gap-0.5"
            href={data.website_url}
            target="_blank"
          >
            <span className="font-semibold">Landing page</span>
            <ExternalWindowIcon />
          </a>
          <a
            className="basis-1/2 text-orange-600 underline flex items-center cursor-pointer gap-0.5"
            href={data.linkedin_url}
            target="_blank"
          >
            <span className="font-semibold">LinkedIn</span>
            <ExternalWindowIcon />
          </a>
        </div>
      </div>
    </PageLayout>
  )
}

export default StartupPage
