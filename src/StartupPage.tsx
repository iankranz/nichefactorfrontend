import { useParams } from "react-router-dom"
import PageLayout from "./PageLayout"
import { useQuery } from "@tanstack/react-query"
import type { Startup } from "./types"

function StartupPage() {
  const { startupId } = useParams()

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

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <PageLayout>
      <div>welcome to</div>
      <div>{data.name}</div>
      <div>{data.summary}</div>
    </PageLayout>
  )
}

export default StartupPage
