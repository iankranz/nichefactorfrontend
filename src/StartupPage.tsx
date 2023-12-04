import { Link, useParams } from "react-router-dom"
import PageLayout from "./PageLayout"
import ExternalWindowIcon from "./ExternalWindowIcon"
import useStartupInteractions from "./hooks/useStartupInteractions"
import { useQuery } from "@tanstack/react-query"
import type { Startup } from "./types"

function StartupPage() {
  const { startupId } = useParams()

  const { startupLocalState, handleFireClick, handleSnoozeClick } =
    useStartupInteractions(startupId)

  const { isPending, isError, data, error } = useQuery({
    queryKey: [`startup-${startupId ?? "unknown"}`],
    queryFn: async () => {
      const response = await fetch(
        `https://api.startupnichefactor.com/startups/${startupId ?? "unknown"}`
      )
      return response.json() as Promise<Startup>
    },
  })

  if (isPending) {
    return <span>Lodaing...</span>
  }

  if (isError && error) {
    return <span>Error: {error.message}</span>
  }

  return (
    <PageLayout>
      <div className="w-full">
        <Link to="/">&larr;Back</Link>
      </div>
      <div className="rounded-xl shadow-sm bg-orange-100 p-4 flex flex-col items-center gap-2 w-full">
        <div className="font-semibold text-3xl">{data.name}</div>
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
